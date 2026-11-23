/**
 * Reusable loading indicators for Arenas UI.
 *
 * Public API:
 * - loading
 * - loading-spinner
 *
 * Loading represents a visual indicator only.
 * Functional processing state belongs to the consumer.
 */

export const loadingKeyframes = {
    '@keyframes aui-loading-spin': {
        to: {
            transform: 'rotate(360deg)',
        },
    },
};

export const loadingStyles = {
    '.loading': {
        display: 'inline-block',
        width: '1rem',
        height: '1rem',
        flexShrink: '0',
        verticalAlign: 'middle',
        color: 'inherit',
    },

    '.loading-spinner': {
        border: '2px solid color-mix(in srgb, currentColor 25%, transparent)',
        borderTopColor: 'currentColor',
        borderRadius: '9999px',

        animation: 'aui-loading-spin 850ms linear infinite',

        '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
        },
    },
};
