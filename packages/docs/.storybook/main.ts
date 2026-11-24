import type { StorybookConfig } from '@storybook/html-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
    stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.ts'],

    addons: ['@storybook/addon-docs'],

    framework: {
        name: '@storybook/html-vite',
        options: {},
    },

    viteFinal: async (config) => {
        return {
            ...config,
            plugins: [...(config.plugins ?? []), tailwindcss()],
        };
    },
};

export default config;
