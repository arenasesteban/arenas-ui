import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import { buttonFixture, presentations, roles, semanticRoles } from '../fixtures/button.fixture.js';

type StyleProperty =
    | 'backgroundColor'
    | 'color'
    | 'borderTopColor'
    | 'borderTopStyle'
    | 'borderTopWidth'
    | 'borderTopLeftRadius'
    | 'paddingTop'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'outlineStyle'
    | 'boxShadow'
    | 'transform'
    | 'transitionDuration'
    | 'transitionTimingFunction';

async function style(page: Page, selector: string, property: StyleProperty): Promise<string> {
    return page
        .locator(selector)
        .evaluate((element, name) => getComputedStyle(element)[name], property);
}

function rgb(value: string): number[] {
    const input = value.trim();

    const srgb = input.match(/^color\(srgb\s+([^)]+)\)$/i);
    const standard = input.match(/^rgba?\(\s*([^)]+)\)$/i);

    const raw = srgb?.[1] ?? standard?.[1];

    if (!raw) {
        throw new Error(`Unsupported color format: ${value}`);
    }

    const channels = raw
        .split('/')[0]
        .trim()
        .split(/[,\s]+/)
        .slice(0, 3)
        .map(Number);

    if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
        throw new Error(`Invalid color channels: ${value}`);
    }

    return srgb ? channels.map((channel) => channel * 255) : channels;
}

function luminance(color: string): number {
    const channels = rgb(color).map((value) => {
        const normalized = value / 255;

        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first: string, second: string): number {
    const a = luminance(first);
    const b = luminance(second);

    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test.beforeEach(async ({ page }) => {
    await page.setContent(buttonFixture);
});

test('Button fixture provides the expected document structure', async ({ page }) => {
    await expect(
        page.getByRole('heading', {
            level: 1,
            name: 'Arenas UI Button Tests',
        }),
    ).toBeVisible();

    const alignItems = await page
        .locator('#light')
        .evaluate((element) => getComputedStyle(element).alignItems);

    expect(['flex-start', 'flow-start']).toContain(alignItems);
});

test('primary and secondary colors invert between themes', async ({ page }) => {
    expect(await style(page, '#light-primary', 'backgroundColor')).toBe('rgb(24, 24, 27)');

    expect(await style(page, '#light-primary', 'color')).toBe('rgb(255, 255, 255)');

    expect(await style(page, '#dark-primary', 'backgroundColor')).toBe('rgb(255, 255, 255)');

    expect(await style(page, '#dark-primary', 'color')).toBe('rgb(24, 24, 27)');

    for (const property of ['backgroundColor', 'color'] as const) {
        expect(await style(page, '#light-primary', property)).toBe(
            await style(page, '#dark-secondary', property),
        );

        expect(await style(page, '#light-secondary', property)).toBe(
            await style(page, '#dark-primary', property),
        );
    }
});

test('solid semantic action colors are identical across themes', async ({ page }) => {
    for (const role of semanticRoles) {
        for (const property of ['backgroundColor', 'color'] as const) {
            expect(await style(page, `#light-${role}`, property), `${role} ${property}`).toBe(
                await style(page, `#dark-${role}`, property),
            );
        }
    }
});

test('semantic solid buttons have sufficient text contrast', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
        for (const role of roles) {
            const selector = `#${theme}-${role}`;

            const foreground = await style(page, selector, 'color');
            const background = await style(page, selector, 'backgroundColor');

            expect(contrast(foreground, background), `${theme} ${role}`).toBeGreaterThanOrEqual(
                4.5,
            );
        }
    }
});

test('outline and ghost remain readable on theme surfaces', async ({ page }) => {
    const cases: Array<[string, string]> = [
        ['#outline', '#light'],
        ['#ghost', '#light'],
        ['#combined', '#light'],
        ['#dark-outline', '#dark'],
        ['#dark-ghost', '#dark'],
    ];

    for (const theme of ['light', 'dark'] as const) {
        for (const role of semanticRoles) {
            for (const presentation of presentations) {
                cases.push([`#${theme}-${role}-${presentation}`, `#${theme}`]);
            }
        }
    }

    for (const [selector, scope] of cases) {
        const foreground = await style(page, selector, 'color');
        const surface = await style(page, scope, 'backgroundColor');

        expect(contrast(foreground, surface), selector).toBeGreaterThanOrEqual(4.5);
    }
});

test('presentation variants and semantic colors compose', async ({ page }) => {
    expect(await style(page, '#outline', 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');

    expect(await style(page, '#ghost', 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');

    expect(await style(page, '#combined', 'color')).toBe(
        await style(page, '#light-success', 'backgroundColor'),
    );

    expect(await style(page, '#combined', 'borderTopColor')).toBe(
        await style(page, '#combined', 'color'),
    );

    for (const theme of ['light', 'dark'] as const) {
        for (const role of semanticRoles) {
            const outline = `#${theme}-${role}-outline`;
            const ghost = `#${theme}-${role}-ghost`;

            const semanticColor = await style(page, outline, 'color');

            expect(await style(page, outline, 'borderTopColor')).toBe(semanticColor);

            expect(await style(page, ghost, 'color')).toBe(semanticColor);

            expect(await style(page, ghost, 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');

            expect(await style(page, ghost, 'borderTopStyle')).toBe('solid');

            expect(await style(page, ghost, 'borderTopWidth')).toBe('1px');

            expect(await style(page, ghost, 'borderTopColor')).toBe('rgba(0, 0, 0, 0)');
        }
    }
});

test('Button sizes, spacing and shapes produce expected dimensions', async ({ page }) => {
    const small = await page.locator('#small').boundingBox();
    const medium = await page.locator('#medium').boundingBox();
    const large = await page.locator('#large').boundingBox();

    if (!small || !medium || !large) {
        throw new Error('Button dimensions could not be measured');
    }

    expect(small.height).toBeLessThan(medium.height);
    expect(medium.height).toBeLessThan(large.height);

    expect(small.height).toBeCloseTo(30, 0);
    expect(medium.height).toBeCloseTo(36, 0);
    expect(large.height).toBeCloseTo(46, 0);

    expect(await style(page, '#medium', 'borderTopLeftRadius')).toBe('6px');

    for (const selector of ['#small', '#medium', '#large']) {
        expect(await style(page, selector, 'paddingTop')).toBe('4px');
        expect(await style(page, selector, 'paddingBottom')).toBe('4px');
    }

    expect(await style(page, '#small', 'paddingLeft')).toBe('12px');

    expect(await style(page, '#medium', 'paddingLeft')).toBe('16px');

    expect(await style(page, '#large', 'paddingLeft')).toBe('20px');

    for (const selector of ['#square', '#circle']) {
        const bounds = await page.locator(selector).boundingBox();

        if (!bounds) {
            throw new Error(`Button dimensions unavailable: ${selector}`);
        }

        expect(bounds.width).toBeCloseTo(bounds.height, 0);
    }

    expect(await style(page, '#circle', 'borderTopLeftRadius')).toBe('9999px');

    expect(await style(page, '#pill', 'borderTopLeftRadius')).toBe('9999px');
});

test('public radius token supports alternative control geometry', async ({ page }) => {
    const button = page.locator('#medium');

    const initialRadius = await style(page, '#medium', 'borderTopLeftRadius');

    for (const [radius, expected] of [
        ['0.375rem', '6px'],
        ['0.5rem', '8px'],
    ] as const) {
        await button.evaluate((element, value) => {
            if (!(element instanceof HTMLElement)) {
                throw new Error('Expected an HTML element');
            }

            element.style.setProperty('--aui-radius-control', value);
        }, radius);

        expect(await style(page, '#medium', 'borderTopLeftRadius')).toBe(expected);
    }

    await button.evaluate((element) => {
        if (!(element instanceof HTMLElement)) {
            throw new Error('Expected an HTML element');
        }

        element.style.removeProperty('--aui-radius-control');
    });

    expect(await style(page, '#medium', 'borderTopLeftRadius')).toBe(initialRadius);
});

test('solid Buttons preserve visible borders in both themes', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
        for (const role of roles) {
            const selector = `#${theme}-${role}`;

            const border = await style(page, selector, 'borderTopColor');
            const background = await style(page, selector, 'backgroundColor');

            expect(await style(page, selector, 'borderTopStyle')).toBe('solid');

            expect(await style(page, selector, 'borderTopWidth')).toBe('1px');

            expect(border, selector).not.toBe(background);
            expect(border, selector).not.toBe('rgba(0, 0, 0, 0)');
        }
    }
});

test('btn-block occupies its container width', async ({ page }) => {
    const dimensions = await page.locator('#block').evaluate((element) => {
        const parent = element.parentElement;

        if (!parent) {
            throw new Error('Button container is missing');
        }

        const parentStyle = getComputedStyle(parent);

        const availableWidth =
            parent.clientWidth -
            parseFloat(parentStyle.paddingLeft) -
            parseFloat(parentStyle.paddingRight);

        return {
            buttonWidth: element.getBoundingClientRect().width,
            availableWidth,
        };
    });

    expect(dimensions.buttonWidth).toBeCloseTo(dimensions.availableWidth, 0);
});

test('hover and active change presentation without moving Button', async ({ page }) => {
    await page.emulateMedia({
        reducedMotion: 'reduce',
    });

    for (const selector of ['#light-primary', '#outline', '#ghost']) {
        const button = page.locator(selector);

        const initialBackground = await style(page, selector, 'backgroundColor');
        const initialBorder = await style(page, selector, 'borderTopColor');
        const initialBounds = await button.boundingBox();

        if (!initialBounds) {
            throw new Error(`Button dimensions unavailable: ${selector}`);
        }

        await button.hover();

        const hoveredBackground = await style(page, selector, 'backgroundColor');

        expect(hoveredBackground).not.toBe(initialBackground);

        expect(await style(page, selector, 'borderTopColor')).toBe(initialBorder);

        expect(await style(page, selector, 'boxShadow')).toBe('none');

        expect(await style(page, selector, 'transform')).toBe('none');

        expect(await button.boundingBox()).toEqual(initialBounds);

        await page.mouse.down();

        const activeBackground = await style(page, selector, 'backgroundColor');

        expect(activeBackground).not.toBe(hoveredBackground);

        expect(await style(page, selector, 'borderTopColor')).toBe(initialBorder);

        expect(await style(page, selector, 'boxShadow')).toBe('none');

        expect(await style(page, selector, 'transform')).toBe('none');

        expect(await button.boundingBox()).toEqual(initialBounds);

        await page.mouse.up();
    }
});

test('solid Buttons retain text contrast in hover and active states', async ({ page }) => {
    await page.emulateMedia({
        reducedMotion: 'reduce',
    });

    for (const theme of ['light', 'dark'] as const) {
        for (const role of roles) {
            const selector = `#${theme}-${role}`;
            const button = page.locator(selector);

            await button.hover();

            const hoverForeground = await style(page, selector, 'color');
            const hoverBackground = await style(page, selector, 'backgroundColor');

            expect(
                contrast(hoverForeground, hoverBackground),
                `Hover contrast: ${theme} ${role}`,
            ).toBeGreaterThanOrEqual(4.5);

            await page.mouse.down();

            const activeForeground = await style(page, selector, 'color');
            const activeBackground = await style(page, selector, 'backgroundColor');

            expect(
                contrast(activeForeground, activeBackground),
                `Active contrast: ${theme} ${role}`,
            ).toBeGreaterThanOrEqual(4.5);

            await page.mouse.up();
        }
    }
});

test('all presentations share the same transition contract', async ({ page }) => {
    const selectors = [
        '#light-primary',
        '#outline',
        '#ghost',
        '#light-success-outline',
        '#dark-error-ghost',
    ];

    const referenceDuration = await style(page, selectors[0], 'transitionDuration');

    const referenceEasing = await style(page, selectors[0], 'transitionTimingFunction');

    expect(referenceDuration.split(',').map((value) => value.trim())).toEqual([
        '0.22s',
        '0.22s',
        '0.22s',
        '0.22s',
    ]);

    for (const selector of selectors) {
        expect(await style(page, selector, 'transitionDuration')).toBe(referenceDuration);

        expect(await style(page, selector, 'transitionTimingFunction')).toBe(referenceEasing);

        expect(await style(page, selector, 'boxShadow')).toBe('none');
    }

    await page.emulateMedia({
        reducedMotion: 'reduce',
    });

    for (const selector of selectors) {
        const durations = (await style(page, selector, 'transitionDuration')).split(',');

        expect(
            durations.every((value) => value.trim() === '0s'),
            selector,
        ).toBe(true);
    }
});

test('public motion tokens allow consumers to customize transitions', async ({ page }) => {
    await page.locator('#light').evaluate((element) => {
        if (!(element instanceof HTMLElement)) {
            throw new Error('Expected a theme container');
        }

        element.style.setProperty('--aui-motion-duration-control', '140ms');
        element.style.setProperty('--aui-motion-easing-control', 'ease-in-out');
    });

    for (const selector of ['#light-primary', '#outline', '#ghost']) {
        const durations = await style(page, selector, 'transitionDuration');
        const easings = await style(page, selector, 'transitionTimingFunction');

        expect(durations.split(',').map((value) => value.trim())).toEqual([
            '0.14s',
            '0.14s',
            '0.14s',
            '0.14s',
        ]);

        expect(easings.split(',').map((value) => value.trim())).toEqual([
            'ease-in-out',
            'ease-in-out',
            'ease-in-out',
            'ease-in-out',
        ]);
    }

    expect(await style(page, '#dark-primary', 'transitionDuration')).toContain('0.22s');
});

test('keyboard activation and focus visibility remain native', async ({ page }) => {
    const button = page.locator('#light-primary');

    await button.evaluate((element) => {
        let count = 0;

        element.setAttribute('data-click-count', '0');

        element.addEventListener('click', () => {
            count += 1;
            element.setAttribute('data-click-count', String(count));
        });
    });

    await page.keyboard.press('Tab');

    await expect(button).toBeFocused();

    expect(await style(page, '#light-primary', 'outlineStyle')).toBe('solid');

    expect(await style(page, '#light-primary', 'boxShadow')).toBe('none');

    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');

    await expect(button).toHaveAttribute('data-click-count', '2');
});

test('native disabled prevents activation', async ({ page }) => {
    const button = page.locator('#disabled');

    await button.evaluate((element) => {
        if (!(element instanceof HTMLButtonElement)) {
            throw new Error('Expected a native HTML button element');
        }

        element.setAttribute('data-click-count', '0');

        element.addEventListener('click', () => {
            element.setAttribute('data-click-count', '1');
        });

        element.click();
    });

    await expect(button).toHaveAttribute('data-click-count', '0');

    await expect(button).toBeDisabled();

    expect(await style(page, '#disabled', 'borderTopWidth')).toBe('1px');

    expect(await style(page, '#disabled', 'boxShadow')).toBe('none');
});

test('loading remains distinct from functional state', async ({ page }) => {
    const visual = page.locator('#loading-visual');
    const managed = page.locator('#loading-managed');

    await expect(visual).toBeEnabled();

    expect(await visual.getAttribute('aria-busy')).toBeNull();

    await expect(managed).toBeDisabled();

    expect(await managed.getAttribute('aria-busy')).toBe('true');

    const spinner = await visual.evaluate(
        (element) => getComputedStyle(element, '::before').animationName,
    );

    expect(spinner).toBe('aui-button-spin');

    await page.emulateMedia({
        reducedMotion: 'reduce',
    });

    const reduced = await visual.evaluate(
        (element) => getComputedStyle(element, '::before').animationName,
    );

    expect(reduced).toBe('none');
});

test('public tokens and Tailwind utilities customize Button', async ({ page }) => {
    expect(await style(page, '#custom-button', 'backgroundColor')).toBe('rgb(18, 52, 86)');

    expect(await style(page, '#custom-button', 'color')).toBe('rgb(255, 255, 255)');

    expect(await style(page, '#utility', 'backgroundColor')).toBe(
        await style(page, '#utility-reference', 'backgroundColor'),
    );

    expect(await style(page, '#utility', 'paddingLeft')).toBe(
        await style(page, '#utility-reference', 'paddingLeft'),
    );

    expect(await style(page, '#utility', 'borderTopLeftRadius')).toBe('0px');
});

test('buttons and styled links preserve accessible semantics', async ({ page }) => {
    await expect(
        page.getByRole('button', {
            name: 'Open menu',
        }),
    ).toBeVisible();

    await expect(
        page.getByRole('button', {
            name: 'Close',
        }),
    ).toBeVisible();

    await expect(
        page.getByRole('link', {
            name: 'Read more',
        }),
    ).toBeVisible();

    await page.locator('#link').click();

    await expect(page).toHaveURL(/#destination$/);
});

test('axe detects no accessibility violations in Button fixtures', async ({ page }) => {
    const results = await new AxeBuilder({
        page,
    }).analyze();

    expect(results.violations).toEqual([]);
});
