import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/browser',
    testMatch: '**/*.spec.ts',
    reporter: 'list',
    outputDir: './test-results',

    use: {
        baseURL: 'http://127.0.0.1:6006',
        browserName: 'chromium',
        headless: true,
    },

    webServer: {
        command: 'pnpm dev',
        url: 'http://127.0.0.1:6006',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
