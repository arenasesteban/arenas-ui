import { expect, test } from '@playwright/test';

test('Storybook renders Button through the public Tailwind plugin', async ({ page }) => {
    await page.goto('/iframe.html?id=components-actions-button--interactive&viewMode=story');

    const button = page.getByRole('button', { name: 'Continue' });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass(/\bbtn\b/);

    const styles = await button.evaluate((element) => {
        const computed = getComputedStyle(element);

        return {
            background: computed.backgroundColor,
            primaryToken: computed.getPropertyValue('--aui-color-primary').trim(),
        };
    });

    expect(styles.primaryToken).toBeTruthy();
    expect(styles.background).not.toBe('rgba(0, 0, 0, 0)');
});

test('Button documentation exposes the public API and organized usage examples', async ({
    page,
}) => {
    const response = await page.request.get('/index.json');

    expect(response.ok()).toBe(true);

    const index = (await response.json()) as {
        entries: Record<
            string,
            {
                type: string;
                title: string;
                name: string;
            }
        >;
    };

    const docsEntry = Object.entries(index.entries).find(
        ([, entry]) => entry.type === 'docs' && entry.title === 'Components/Actions/Button',
    );

    expect(docsEntry, 'Button must have a registered Storybook documentation entry').toBeDefined();

    const [docsId] = docsEntry!;

    await page.goto(`/iframe.html?id=${encodeURIComponent(docsId)}&viewMode=docs`);

    const sectionHeading = (name: string) =>
        page.getByRole('heading', { level: 2 }).filter({ hasText: new RegExp(`^${name}$`) });

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Button');

    await expect(sectionHeading('Class reference')).toBeVisible();

    const classTable = page.locator('.aui-docs-class-table');

    await expect(classTable).toBeVisible();

    await expect(classTable.locator('thead th')).toHaveText(['Class', 'Category', 'Description']);

    for (const name of ['Solid', 'Outline', 'Ghost', 'Smooth']) {
        await expect(sectionHeading(name)).toBeVisible();
    }

    for (const name of [
        'Basic usage',
        'Sizes',
        'Loading state',
        'Icons and links',
        'Customization',
    ]) {
        await expect(sectionHeading(name)).toBeVisible();
    }

    await expect(
        classTable.locator('code').filter({
            hasText: /^btn-smooth$/,
        }),
    ).toBeVisible();

    await expect(sectionHeading('Accessibility')).toHaveCount(0);
});
