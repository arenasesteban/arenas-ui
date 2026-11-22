import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const css = readFileSync(new URL('./plugin.generated.css', import.meta.url), 'utf8');

const html = `
<!doctype html>
<html lang="en">
    <head>
        <style>${css}</style>
    </head>
    <body>
        <div id="root-probe"></div>
        <div id="plain-element">Unstyled content</div>

        <div id="dark-section" data-theme="dark">
        <div id="dark-child"></div>

        <div id="light-section" data-theme="light">
            <div id="light-child"></div>
        </div>
        </div>

        <div id="custom-brand">
            <div id="custom-child"></div>
        </div>

        <div id="primary-swatch" class="aui-token-probe"></div>
        <div id="utility-swatch" class="aui-token-probe bg-blue-500"></div>
        <div id="tailwind-reference" class="bg-blue-500"></div>
    </body>
</html>
`;

async function token(page: Page, selector: string, name: string): Promise<string> {
    return page
        .locator(selector)
        .evaluate(
            (element, property) => getComputedStyle(element).getPropertyValue(property).trim(),
            name,
        );
}

async function resolvedColor(page: Page, selector: string, name: string): Promise<string> {
    return page.locator(selector).evaluate((element, property) => {
        const value = getComputedStyle(element).getPropertyValue(property).trim();

        if (!value) {
            throw new Error(`Missing CSS token: ${property}`);
        }

        const probe = document.createElement('span');
        probe.style.color = `var(${property})`;

        element.appendChild(probe);

        const color = getComputedStyle(probe).color;
        probe.remove();

        return color;
    }, name);
}

async function background(page: Page, selector: string): Promise<string> {
    return page.locator(selector).evaluate((element) => getComputedStyle(element).backgroundColor);
}

function luminance(color: string): number {
    const matches = color.match(/\d+(?:\.\d+)?/g);

    if (!color.startsWith('rgb(') || !matches || matches.length < 3) {
        throw new Error(`Unexpected color format: ${color}`);
    }

    const channels = matches.slice(0, 3).map((value) => Number(value) / 255);

    const linear = channels.map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );

    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first: string, second: string): number {
    const lighter = Math.max(luminance(first), luminance(second));
    const darker = Math.min(luminance(first), luminance(second));

    return (lighter + 0.05) / (darker + 0.05);
}

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.setContent(html);
});

test('follows the system color scheme by default', async ({ page }) => {
    expect(await resolvedColor(page, '#root-probe', '--aui-color-primary')).toBe('rgb(41, 37, 36)');

    await page.emulateMedia({ colorScheme: 'dark' });

    expect(await resolvedColor(page, '#root-probe', '--aui-color-primary')).toBe(
        'rgb(231, 229, 228)',
    );
});

test('explicit theme selection overrides the system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.locator('html').evaluate((element) => {
        element.setAttribute('data-theme', 'light');
    });

    expect(await resolvedColor(page, '#root-probe', '--aui-color-primary')).toBe('rgb(41, 37, 36)');

    await page.emulateMedia({ colorScheme: 'light' });

    await page.locator('html').evaluate((element) => {
        element.setAttribute('data-theme', 'dark');
    });

    expect(await resolvedColor(page, '#root-probe', '--aui-color-primary')).toBe(
        'rgb(231, 229, 228)',
    );
});

test('nested themes inherit their own tokens', async ({ page }) => {
    expect(await resolvedColor(page, '#dark-child', '--aui-color-primary')).toBe(
        'rgb(231, 229, 228)',
    );

    expect(await resolvedColor(page, '#light-child', '--aui-color-primary')).toBe(
        'rgb(41, 37, 36)',
    );

    expect(await token(page, '#dark-child', '--aui-control-height')).toBe('2.5rem');
});

test('consumer token overrides are inherited', async ({ page }) => {
    expect(await resolvedColor(page, '#custom-child', '--aui-color-primary')).toBe(
        'rgb(18, 52, 86)',
    );

    expect(await resolvedColor(page, '#custom-child', '--aui-color-surface')).toBe(
        'rgb(250, 250, 249)',
    );
});

test('Tailwind utilities override component-layer styles', async ({ page }) => {
    const utilityBackground = await background(page, '#utility-swatch');
    const referenceBackground = await background(page, '#tailwind-reference');
    const primaryBackground = await background(page, '#primary-swatch');

    expect(utilityBackground).toBe(referenceBackground);
    expect(utilityBackground).not.toBe(primaryBackground);
});

test('tokens do not apply global background styles', async ({ page }) => {
    expect(await background(page, 'body')).toBe('rgba(0, 0, 0, 0)');
});

test('semantic tokens meet initial contrast requirements', async ({ page }) => {
    const pairs = [
        ['--aui-color-primary', '--aui-color-primary-content'],
        ['--aui-color-secondary', '--aui-color-secondary-content'],
        ['--aui-color-success', '--aui-color-success-content'],
        ['--aui-color-warning', '--aui-color-warning-content'],
        ['--aui-color-error', '--aui-color-error-content'],
        ['--aui-color-surface', '--aui-color-text'],
    ] as const;

    for (const theme of ['light', 'dark']) {
        await page.locator('html').evaluate((element, value) => {
            element.setAttribute('data-theme', value);
        }, theme);

        for (const [backgroundToken, foregroundToken] of pairs) {
            const backgroundColor = await resolvedColor(page, '#root-probe', backgroundToken);

            const foregroundColor = await resolvedColor(page, '#root-probe', foregroundToken);

            expect(
                contrast(backgroundColor, foregroundColor),
                `${theme}: ${foregroundToken} on ${backgroundToken}`,
            ).toBeGreaterThanOrEqual(4.5);
        }

        const surface = await resolvedColor(page, '#root-probe', '--aui-color-surface');

        const focus = await resolvedColor(page, '#root-probe', '--aui-color-focus');

        const border = await resolvedColor(page, '#root-probe', '--aui-color-border');

        expect(contrast(focus, surface)).toBeGreaterThanOrEqual(3);
        expect(contrast(border, surface)).toBeGreaterThanOrEqual(3);
    }
});
