import { darkTokens, lightTokens, sharedTokens } from './tokens.js';

/**
 * CSS rules registered by the Tailwind plugin.
 *
 * Theme resolution:
 * - No data-theme: follow the system preference.
 * - data-theme="light": force light.
 * - data-theme="dark": force dark.
 * - Nested themed containers: inherit their own token values.
 */
export const themeStyles = {
    ':root': {
        ...sharedTokens,
        ...lightTokens,
    },

    '[data-theme="light"]': {
        ...lightTokens,
    },

    '@media (prefers-color-scheme: dark)': {
        ':root:not([data-theme])': {
            ...darkTokens,
        },
    },

    '[data-theme="dark"]': {
        ...darkTokens,
    },
};
