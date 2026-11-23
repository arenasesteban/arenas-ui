/**
 * Button CSS registered by the Tailwind plugin.
 *
 * Public API: btn and documented btn-* modifiers.
 *
 * Public --aui-* tokens control the visual identity.
 * Internal --_aui-btn-* variables resolve component
 * composition and are not part of the public token API.
 */

export const buttonKeyframes = {
    '@keyframes aui-button-spin': {
        to: {
            transform: 'rotate(360deg)',
        },
    },
};

export const buttonStyles = {
    // Base
    '.btn': {
        '--_aui-btn-color': 'var(--aui-color-primary)',
        '--_aui-btn-content': 'var(--aui-color-primary-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-primary-emphasis, var(--aui-color-primary))',

        '--_aui-btn-height': 'var(--aui-control-height, 2.25rem)',
        '--_aui-btn-padding': 'var(--aui-control-padding-inline, 1rem)',

        // Solid border remains visible and stable across interactions.
        '--_aui-btn-border':
            'color-mix(in srgb, var(--_aui-btn-color) 82%, var(--_aui-btn-content) 18%)',

        // Feedback is independent from the border.
        '--_aui-btn-feedback': 'var(--_aui-btn-content)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-color) 90%, var(--_aui-btn-feedback) 10%)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-color) 82%, var(--_aui-btn-feedback) 18%)',

        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        verticalAlign: 'middle',

        minHeight: 'var(--_aui-btn-height)',
        paddingBlock: '0.25rem',
        paddingInline: 'var(--_aui-btn-padding)',

        border: '1px solid var(--_aui-btn-border)',
        borderRadius: 'var(--aui-radius-control, 0.375rem)',

        backgroundColor: 'var(--_aui-btn-color)',
        color: 'var(--_aui-btn-content)',

        fontFamily: 'inherit',
        fontSize: '0.875rem',
        fontWeight: '600',
        lineHeight: '1.25rem',
        textDecoration: 'none',

        cursor: 'pointer',
        userSelect: 'none',

        // Shared motion contract for all presentation variants.
        transition: [
            'background-color var(--aui-motion-duration-control, 220ms) var(--aui-motion-easing-control, cubic-bezier(0.2, 0.7, 0.2, 1))',
            'border-color var(--aui-motion-duration-control, 220ms) var(--aui-motion-easing-control, cubic-bezier(0.2, 0.7, 0.2, 1))',
            'color var(--aui-motion-duration-control, 220ms) var(--aui-motion-easing-control, cubic-bezier(0.2, 0.7, 0.2, 1))',
            'opacity var(--aui-motion-duration-control, 220ms) var(--aui-motion-easing-control, cubic-bezier(0.2, 0.7, 0.2, 1))',
        ].join(', '),

        '@media (prefers-reduced-motion: reduce)': {
            transitionDuration: '0ms',
        },
    },

    // Semantic colors
    '.btn-secondary': {
        '--_aui-btn-color': 'var(--aui-color-secondary)',
        '--_aui-btn-content': 'var(--aui-color-secondary-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-secondary-emphasis, var(--aui-color-secondary))',
    },

    '.btn-success': {
        '--_aui-btn-color': 'var(--aui-color-success)',
        '--_aui-btn-content': 'var(--aui-color-success-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-success-emphasis, var(--aui-color-success))',

        // Darken solid interactions to preserve white text contrast.
        '--_aui-btn-feedback': '#000000',
    },

    '.btn-warning': {
        '--_aui-btn-color': 'var(--aui-color-warning)',
        '--_aui-btn-content': 'var(--aui-color-warning-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-warning-emphasis, var(--aui-color-warning))',

        '--_aui-btn-feedback': '#000000',
    },

    '.btn-error': {
        '--_aui-btn-color': 'var(--aui-color-error)',
        '--_aui-btn-content': 'var(--aui-color-error-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-error-emphasis, var(--aui-color-error))',

        '--_aui-btn-feedback': '#000000',
    },

    // Outline: transparent surface, semantic text and border.
    '.btn-outline': {
        backgroundColor: 'transparent',
        borderColor: 'var(--_aui-btn-emphasis)',
        color: 'var(--_aui-btn-emphasis)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 7%, transparent)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 14%, transparent)',
    },

    // Ghost: transparent surface and border, semantic text.
    '.btn-ghost': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'var(--_aui-btn-emphasis)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 9%, transparent)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 18%, transparent)',
    },

    // Shared hover interaction.
    '.btn:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: 'var(--_aui-btn-hover-background)',
    },

    // Shared active interaction.
    '.btn:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: 'var(--_aui-btn-active-background)',
    },

    // Keyboard focus without shadows or movement.
    '.btn:focus-visible': {
        outline: '2px solid var(--aui-color-focus)',
        outlineOffset: '3px',
    },

    // Native and ARIA disabled presentation.
    '.btn:is(:disabled, [aria-disabled="true"])': {
        opacity: '0.55',
        cursor: 'not-allowed',
    },

    // Sizes
    '.btn-sm': {
        '--_aui-btn-height': '1.875rem',
        '--_aui-btn-padding': '0.75rem',
        fontSize: '0.75rem',
    },

    '.btn-md': {
        '--_aui-btn-height': 'var(--aui-control-height, 2.25rem)',
        '--_aui-btn-padding': 'var(--aui-control-padding-inline, 1rem)',
        fontSize: '0.875rem',
    },

    '.btn-lg': {
        '--_aui-btn-height': '2.875rem',
        '--_aui-btn-padding': '1.25rem',
        fontSize: '1rem',
    },

    // Shapes
    '.btn-pill': {
        borderRadius: '9999px',
    },

    '.btn-square': {
        width: 'var(--_aui-btn-height)',
        height: 'var(--_aui-btn-height)',
        minWidth: 'var(--_aui-btn-height)',
        padding: '0',
    },

    '.btn-circle': {
        width: 'var(--_aui-btn-height)',
        height: 'var(--_aui-btn-height)',
        minWidth: 'var(--_aui-btn-height)',
        padding: '0',
        borderRadius: '9999px',
    },

    // Layout
    '.btn-block': {
        display: 'flex',
        width: '100%',
    },

    // Visual-only loading indicator.
    '.btn-loading::before': {
        content: '""',
        display: 'inline-block',

        width: '1rem',
        height: '1rem',
        flexShrink: '0',

        border: '2px solid color-mix(in srgb, currentColor 25%, transparent)',

        borderTopColor: 'currentColor',
        borderRadius: '9999px',

        animation: 'aui-button-spin 850ms linear infinite',

        '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
        },
    },
};
