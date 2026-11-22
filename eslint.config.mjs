import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(globalIgnores(['**/dist/**', '**/node_modules/**']), {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
});
