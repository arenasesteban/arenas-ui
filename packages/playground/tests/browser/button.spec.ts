import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import { buttonFixture, roles, semanticRoles, variants } from '../fixtures/button.fixture.js';

type Theme = 'light' | 'dark';
type Role = (typeof roles)[number];
type Variant = (typeof variants)[number];

type StyleProperty =
    | 'backgroundColor'
    | 'color'
    | 'borderTopColor'
    | 'borderTopWidth'
    | 'borderTopLeftRadius'
    | 'paddingLeft'
    | 'outlineStyle'
    | 'transitionDuration'
    | 'transitionTimingFunction';

const themes = ['light', 'dark'] as const;
const transparent = 'rgba(0, 0, 0, 0)';

async function style(page: Page, selector: string, property: StyleProperty): Promise<string> {
    return page
        .locator(selector)
        .evaluate((element, name) => getComputedStyle(element)[name], property);
}

function enabledSelector(theme: Theme, role: Role, variant: Variant): string {
    return variant === 'default' ? `#${theme}-${role}` : `#${theme}-${role}-${variant}`;
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

async function textContrast(
    page: Page,
    theme: Theme,
    role: Role,
    variant: Variant,
): Promise<number> {
    const selector = enabledSelector(theme, role, variant);

    const foreground = await style(page, selector, 'color');

    const background =
        variant === 'outline' || variant === 'ghost'
            ? await style(page, `#${theme}`, 'backgroundColor')
            : await style(page, selector, 'backgroundColor');

    return contrast(foreground, background);
}

test.beforeEach(async ({ page }) => {
    await page.setContent(buttonFixture);
});

test.describe('Appearance', () => {
    test('primary and secondary remain visually distinct', async ({ page }) => {
        for (const theme of themes) {
            for (const variant of variants) {
                const primary = enabledSelector(theme, 'primary', variant);

                const secondary = enabledSelector(theme, 'secondary', variant);

                expect(await style(page, primary, 'color')).not.toBe(
                    await style(page, secondary, 'color'),
                );

                if (variant === 'default' || variant === 'smooth') {
                    expect(await style(page, primary, 'backgroundColor')).not.toBe(
                        await style(page, secondary, 'backgroundColor'),
                    );
                }

                if (variant === 'outline') {
                    expect(await style(page, primary, 'borderTopColor')).not.toBe(
                        await style(page, secondary, 'borderTopColor'),
                    );
                }
            }
        }
    });

    test('semantic colors remain consistent across themes', async ({ page }) => {
        for (const role of semanticRoles) {
            for (const property of ['backgroundColor', 'color'] as const) {
                expect(await style(page, `#light-${role}`, property)).toBe(
                    await style(page, `#dark-${role}`, property),
                );
            }
        }
    });

    test('variants preserve their presentation characteristics', async ({ page }) => {
        for (const theme of themes) {
            const surface = await style(page, `#${theme}`, 'backgroundColor');

            for (const role of roles) {
                const solid = enabledSelector(theme, role, 'default');

                const outline = enabledSelector(theme, role, 'outline');

                const ghost = enabledSelector(theme, role, 'ghost');

                const smooth = enabledSelector(theme, role, 'smooth');

                expect(await style(page, solid, 'backgroundColor')).not.toBe(transparent);

                expect(await style(page, outline, 'backgroundColor')).toBe(transparent);

                expect(await style(page, outline, 'borderTopColor')).toBe(
                    await style(page, outline, 'color'),
                );

                expect(await style(page, ghost, 'backgroundColor')).toBe(transparent);

                expect(await style(page, ghost, 'borderTopColor')).toBe(transparent);

                expect(await style(page, smooth, 'backgroundColor')).not.toBe(surface);
            }
        }
    });

    test('enabled buttons meet text contrast requirements', async ({ page }) => {
        for (const theme of themes) {
            for (const role of roles) {
                for (const variant of variants) {
                    const ratio = await textContrast(page, theme, role, variant);

                    expect(ratio, `${theme} ${role} ${variant}`).toBeGreaterThanOrEqual(4.5);
                }
            }
        }
    });

    test('solid and smooth buttons preserve contrast during interaction', async ({ page }) => {
        await page.emulateMedia({
            reducedMotion: 'reduce',
        });

        for (const theme of themes) {
            for (const role of roles) {
                for (const variant of ['default', 'smooth'] as const) {
                    const selector = enabledSelector(theme, role, variant);

                    const button = page.locator(selector);

                    await button.hover();

                    expect(
                        contrast(
                            await style(page, selector, 'color'),
                            await style(page, selector, 'backgroundColor'),
                        ),
                        `${selector} hover`,
                    ).toBeGreaterThanOrEqual(4.5);

                    await page.mouse.down();

                    expect(
                        contrast(
                            await style(page, selector, 'color'),
                            await style(page, selector, 'backgroundColor'),
                        ),
                        `${selector} active`,
                    ).toBeGreaterThanOrEqual(4.5);

                    await page.mouse.up();
                }
            }
        }
    });

    test('semantic, presentation and size modifiers compose', async ({ page }) => {
        expect(await style(page, '#combined', 'color')).toBe(
            await style(page, '#light-success-outline', 'color'),
        );

        expect(await style(page, '#combined', 'borderTopColor')).toBe(
            await style(page, '#combined', 'color'),
        );

        const combined = await page.locator('#combined').boundingBox();
        const large = await page.locator('#large').boundingBox();

        if (!combined || !large) {
            throw new Error('Button dimensions could not be measured');
        }

        expect(combined.height).toBeCloseTo(large.height, 0);
    });
});

test.describe('Geometry', () => {
    test('sizes and shapes follow the public design contract', async ({ page }) => {
        const sizes = [
            { selector: '#small', height: 30, padding: '14px' },
            { selector: '#medium', height: 36, padding: '20px' },
            { selector: '#large', height: 46, padding: '24px' },
        ];

        for (const size of sizes) {
            const bounds = await page.locator(size.selector).boundingBox();

            expect(bounds?.height).toBeCloseTo(size.height, 0);

            expect(await style(page, size.selector, 'paddingLeft')).toBe(size.padding);
        }

        expect(await style(page, '#medium', 'borderTopLeftRadius')).toBe('10px');

        for (const selector of ['#square', '#circle']) {
            const bounds = await page.locator(selector).boundingBox();

            expect(bounds).not.toBeNull();

            if (!bounds) {
                throw new Error(`Button dimensions unavailable: ${selector}`);
            }

            expect(bounds.width).toBeCloseTo(bounds.height, 0);
        }

        for (const selector of ['#pill', '#circle']) {
            expect(await style(page, selector, 'borderTopLeftRadius')).toBe('9999px');
        }
    });

    test('radius and block layout remain customizable', async ({ page }) => {
        const medium = page.locator('#medium');

        await medium.evaluate((element) => {
            element.style.setProperty('--aui-radius-control', '0.5rem');
        });

        expect(await style(page, '#medium', 'borderTopLeftRadius')).toBe('8px');

        const dimensions = await page.locator('#block').evaluate((element) => {
            const parent = element.parentElement;

            if (!parent) {
                throw new Error('Missing Button container');
            }

            const parentStyle = getComputedStyle(parent);

            return {
                width: element.getBoundingClientRect().width,
                available:
                    parent.clientWidth -
                    parseFloat(parentStyle.paddingLeft) -
                    parseFloat(parentStyle.paddingRight),
            };
        });

        expect(dimensions.width).toBeCloseTo(dimensions.available, 0);
    });
});

test.describe('Interaction', () => {
    test('hover and pressed provide feedback without changing layout', async ({ page }) => {
        await page.emulateMedia({
            reducedMotion: 'reduce',
        });

        for (const variant of variants) {
            const selector = enabledSelector('light', 'primary', variant);

            const button = page.locator(selector);

            const initialBackground = await style(page, selector, 'backgroundColor');

            const initialBounds = await button.boundingBox();

            await button.hover();

            const hoverBackground = await style(page, selector, 'backgroundColor');

            expect(hoverBackground).not.toBe(initialBackground);
            expect(await button.boundingBox()).toEqual(initialBounds);

            await page.mouse.down();

            const activeBackground = await style(page, selector, 'backgroundColor');

            expect(activeBackground).not.toBe(hoverBackground);
            expect(await button.boundingBox()).toEqual(initialBounds);

            await page.mouse.up();
        }
    });

    test('motion tokens customize transitions and respect reduced motion', async ({ page }) => {
        const selectors = variants.map((variant) => enabledSelector('light', 'primary', variant));

        const referenceDuration = await style(page, selectors[0], 'transitionDuration');

        for (const selector of selectors) {
            expect(await style(page, selector, 'transitionDuration')).toBe(referenceDuration);
        }

        await page.locator('#light').evaluate((element) => {
            element.style.setProperty('--aui-motion-duration-control', '140ms');

            element.style.setProperty('--aui-motion-easing-control', 'ease-in-out');
        });

        for (const selector of selectors) {
            const durations = (await style(page, selector, 'transitionDuration')).split(',');

            const easings = (await style(page, selector, 'transitionTimingFunction')).split(',');

            expect(durations.every((value) => value.trim() === '0.14s')).toBe(true);

            expect(easings.every((value) => value.trim() === 'ease-in-out')).toBe(true);
        }

        await page.emulateMedia({
            reducedMotion: 'reduce',
        });

        for (const selector of selectors) {
            const durations = (await style(page, selector, 'transitionDuration')).split(',');

            expect(durations.every((value) => value.trim() === '0s')).toBe(true);
        }
    });

    test.describe('States', () => {
        test('disabled buttons use neutral styles across roles', async ({ page }) => {
            for (const theme of themes) {
                for (const variant of variants) {
                    const reference = `#${theme}-primary-${variant}-disabled`;

                    for (const role of roles) {
                        const selector = `#${theme}-${role}-${variant}-disabled`;

                        await expect(page.locator(selector)).toBeDisabled();

                        for (const property of [
                            'backgroundColor',
                            'borderTopColor',
                            'color',
                        ] as const) {
                            expect(
                                await style(page, selector, property),
                                `${theme} ${role} ${variant} disabled`,
                            ).toBe(await style(page, reference, property));
                        }
                    }
                }

                const disabled = (variant: Variant) => `#${theme}-primary-${variant}-disabled`;

                expect(await style(page, disabled('default'), 'backgroundColor')).not.toBe(
                    await style(page, disabled('ghost'), 'backgroundColor'),
                );

                expect(await style(page, disabled('outline'), 'borderTopColor')).not.toBe(
                    await style(page, disabled('ghost'), 'borderTopColor'),
                );
            }
        });

        test('processing preserves the presentation and blocks activation', async ({ page }) => {
            for (const theme of themes) {
                for (const role of roles) {
                    for (const variant of variants) {
                        const enabled = enabledSelector(theme, role, variant);

                        const processing = `#${theme}-${role}-${variant}-processing`;

                        const button = page.locator(processing);

                        await expect(button).toBeDisabled();

                        await expect(button).toHaveAttribute('aria-busy', 'true');

                        await expect(button.locator('.loading.loading-spinner')).toBeVisible();

                        for (const property of [
                            'backgroundColor',
                            'borderTopColor',
                            'color',
                        ] as const) {
                            expect(
                                await style(page, processing, property),
                                `${theme} ${role} ${variant} processing`,
                            ).toBe(await style(page, enabled, property));
                        }
                    }
                }
            }
        });

        test('processing ignores hover and pressed feedback', async ({ page }) => {
            await page.emulateMedia({
                reducedMotion: 'reduce',
            });

            for (const variant of variants) {
                const selector = `#light-primary-${variant}-processing`;

                const button = page.locator(selector);

                const background = await style(page, selector, 'backgroundColor');

                await button.hover({ force: true });

                expect(await style(page, selector, 'backgroundColor')).toBe(background);

                await page.mouse.down();

                expect(await style(page, selector, 'backgroundColor')).toBe(background);

                await page.mouse.up();
            }
        });

        test('native disabled buttons cannot be activated', async ({ page }) => {
            const button = page.locator('#light-primary-default-disabled');

            await button.evaluate((element) => {
                if (!(element instanceof HTMLButtonElement)) {
                    throw new Error('Expected a native Button');
                }

                element.setAttribute('data-click-count', '0');

                element.addEventListener('click', () => {
                    element.setAttribute('data-click-count', '1');
                });

                element.click();
            });

            await expect(button).toBeDisabled();

            await expect(button).toHaveAttribute('data-click-count', '0');
        });

        test('Loading works independently and respects reduced motion', async ({ page }) => {
            const visual = page.locator('#loading-visual');
            const standalone = page.locator('#standalone-spinner');

            await expect(visual).toBeEnabled();

            await expect(visual.locator('.loading.loading-spinner')).toBeVisible();

            await expect(standalone).toBeVisible();

            const spinner = visual.locator('.loading-spinner');

            const animation = await spinner.evaluate(
                (element) => getComputedStyle(element).animationName,
            );

            expect(animation).not.toBe('none');

            await page.emulateMedia({
                reducedMotion: 'reduce',
            });

            const reducedAnimation = await spinner.evaluate(
                (element) => getComputedStyle(element).animationName,
            );

            expect(reducedAnimation).toBe('none');
        });
    });

    test.describe('Consumer integration', () => {
        test('public tokens and Tailwind utilities customize Button', async ({ page }) => {
            expect(await style(page, '#custom-button', 'backgroundColor')).toBe('rgb(18, 52, 86)');

            expect(await style(page, '#custom-button', 'color')).toBe('rgb(255, 255, 255)');

            for (const property of [
                'backgroundColor',
                'paddingLeft',
                'borderTopLeftRadius',
            ] as const) {
                expect(await style(page, '#utility', property)).toBe(
                    await style(page, '#utility-reference', property),
                );
            }
        });
    });

    test.describe('Accessibility', () => {
        test('native keyboard activation and focus remain accessible', async ({ page }) => {
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

            await page.keyboard.press('Enter');
            await page.keyboard.press('Space');

            await expect(button).toHaveAttribute('data-click-count', '2');
        });

        test('buttons and styled links retain native semantics', async ({ page }) => {
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

        test('Button fixtures have no detected accessibility violations', async ({ page }) => {
            const results = await new AxeBuilder({
                page,
            }).analyze();

            expect(results.violations).toEqual([]);
        });
    });
});
