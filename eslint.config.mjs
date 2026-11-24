import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores(['**/dist/**', '**/node_modules/**', '**/.astro/**', '**/storybook-static/**']),
    {
        files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
    },
    ...storybook.configs['flat/recommended'],
);
