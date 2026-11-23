/**
 * Button CSS registered by the Tailwind plugin.
 *
 * Public API: btn and documented btn-* modifiers.
 *
 * Public --aui-* tokens control the visual identity.
 * Internal --_aui-btn-* variables resolve component
 * composition and are not part of the public token API.
 */

export const buttonStyles = {
    // Base
    '.btn': {
        '--_aui-btn-color': 'var(--aui-color-primary)',
        '--_aui-btn-content': 'var(--aui-color-primary-content)',
        '--_aui-btn-emphasis': 'var(--aui-color-primary-emphasis, var(--aui-color-primary))',

        '--_aui-btn-height': 'var(--aui-control-height, 2.25rem)',
        '--_aui-btn-padding': 'var(--aui-control-padding-inline, 1.25rem)',

        // Visible solid border.
        '--_aui-btn-border':
            'color-mix(in srgb, var(--_aui-btn-color) 82%, var(--_aui-btn-content) 18%)',

        // Solid interaction feedback.
        '--_aui-btn-feedback': 'var(--_aui-btn-content)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-color) 90%, var(--_aui-btn-feedback) 10%)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-color) 82%, var(--_aui-btn-feedback) 18%)',

        // Geometry
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        verticalAlign: 'middle',

        minHeight: 'var(--_aui-btn-height)',
        paddingBlock: '0.1875rem',
        paddingInline: 'var(--_aui-btn-padding)',

        border: '1px solid var(--_aui-btn-border)',
        borderRadius: 'var(--aui-radius-control, 0.625rem)',

        // Appearance
        backgroundColor: 'var(--_aui-btn-color)',
        color: 'var(--_aui-btn-content)',

        fontFamily: 'inherit',
        fontSize: '0.875rem',
        fontWeight: '600',
        lineHeight: '1.25rem',
        textDecoration: 'none',

        cursor: 'pointer',
        userSelect: 'none',
        opacity: '1',

        // Shared motion
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

    // Outline: transparent surface and semantic border.
    '.btn-outline': {
        backgroundColor: 'transparent',
        borderColor: 'var(--_aui-btn-emphasis)',
        color: 'var(--_aui-btn-emphasis)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 7%, transparent)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 14%, transparent)',
    },

    // Ghost: transparent surface and border at rest.
    '.btn-ghost': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'var(--_aui-btn-emphasis)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 9%, transparent)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 18%, transparent)',
    },

    // Smooth: subtle semantic surface visible at rest.
    '.btn-smooth': {
        backgroundColor:
            'color-mix(in srgb, var(--_aui-btn-emphasis) 10%, var(--aui-color-surface) 90%)',

        borderColor: 'transparent',

        color: 'color-mix(in srgb, var(--_aui-btn-emphasis) 70%, var(--aui-color-text) 30%)',

        '--_aui-btn-hover-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 16%, var(--aui-color-surface) 84%)',

        '--_aui-btn-active-background':
            'color-mix(in srgb, var(--_aui-btn-emphasis) 22%, var(--aui-color-surface) 78%)',
    },

    // Hover excludes disabled and processing buttons.
    '.btn:hover:not(:disabled):not([aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'var(--_aui-btn-hover-background)',
    },

    // Pressed excludes disabled and processing buttons.
    '.btn:active:not(:disabled):not([aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'var(--_aui-btn-active-background)',
    },

    // Keyboard focus.
    '.btn:focus-visible': {
        outline: '2px solid var(--aui-color-focus)',
        outlineOffset: '3px',
    },

    // Disabled: neutral presentation, excluding processing.
    '.btn:is(:disabled, [aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'var(--aui-color-disabled-surface)',
        borderColor: 'var(--aui-color-disabled-border)',
        color: 'var(--aui-color-disabled-content)',
        cursor: 'not-allowed',
    },

    // Disabled outline retains its transparent surface.
    '.btn.btn-outline:is(:disabled, [aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'transparent',
        borderColor: 'var(--aui-color-disabled-border)',
    },

    // Disabled ghost retains its transparent presentation.
    '.btn.btn-ghost:is(:disabled, [aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },

    // Disabled smooth retains a subtle neutral surface.
    '.btn.btn-smooth:is(:disabled, [aria-disabled="true"]):not([aria-busy="true"])': {
        backgroundColor: 'var(--aui-color-disabled-smooth)',
        borderColor: 'transparent',
    },

    // Processing preserves the active presentation.
    '.btn[aria-busy="true"]': {
        cursor: 'progress',
    },

    // Sizes
    '.btn-sm': {
        '--_aui-btn-height': '1.875rem',
        '--_aui-btn-padding': '0.875rem',
        fontSize: '0.75rem',
    },

    '.btn-md': {
        '--_aui-btn-height': 'var(--aui-control-height, 2.25rem)',
        '--_aui-btn-padding': 'var(--aui-control-padding-inline, 1.25rem)',
        fontSize: '0.875rem',
    },

    '.btn-lg': {
        '--_aui-btn-height': '2.875rem',
        '--_aui-btn-padding': '1.5rem',
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
};
