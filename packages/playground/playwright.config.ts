import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',
    reporter: 'list',
    outputDir: './test-results',
    use: {
        browserName: 'chromium',
        headless: true,
    },
});
