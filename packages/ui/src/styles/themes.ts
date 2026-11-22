import { darkTokens, lightTokens, sharedTokens } from './tokens.js';

/**
 * Theme precedence:
 * - Default: light.
 * - System preference: dark when no explicit root theme exists.
 * - data-theme: explicit light/dark selection.
 * - Nested themes: override inherited values within their subtree.
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
