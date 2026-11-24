import type { Meta, StoryObj } from '@storybook/html-vite';

type Theme = 'light' | 'dark';
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type Variant = 'solid' | 'outline' | 'ghost' | 'smooth';
type Size = 'default' | 'sm' | 'md' | 'lg';
type Shape = 'default' | 'pill' | 'square' | 'circle';

type ButtonArgs = {
    label: string;
    theme: Theme;
    color: Color;
    variant: Variant;
    size: Size;
    shape: Shape;
    block: boolean;
    disabled: boolean;
    processing: boolean;
    icon: boolean;
};

const initialArgs: ButtonArgs = {
    label: 'Continue',
    theme: 'light',
    color: 'primary',
    variant: 'solid',
    size: 'default',
    shape: 'default',
    block: false,
    disabled: false,
    processing: false,
    icon: false,
};

const checkIcon = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
>
    <path d="M5 12l4 4L19 6" />
</svg>`;

function escapeHtml(value: string): string {
    const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return value.replace(/[&<>"']/g, (character) => entities[character] ?? character);
}

function buttonClasses(args: ButtonArgs): string {
    return [
        'btn',
        args.color === 'primary' ? '' : `btn-${args.color}`,
        args.variant === 'solid' ? '' : `btn-${args.variant}`,
        args.size === 'default' ? '' : `btn-${args.size}`,
        args.shape === 'default' ? '' : `btn-${args.shape}`,
        args.block ? 'btn-block' : '',
    ]
        .filter(Boolean)
        .join(' ');
}

function interactiveButton(args: ButtonArgs): string {
    const iconOnly = args.shape === 'square' || args.shape === 'circle';
    const disabled = args.disabled || args.processing;

    const disabledAttribute = disabled ? ' disabled' : '';
    const busyAttribute = args.processing ? ' aria-busy="true"' : '';
    const labelAttribute = iconOnly ? ` aria-label="${escapeHtml(args.label)}"` : '';

    const content = args.processing
        ? `
            <span class="loading loading-spinner" aria-hidden="true"></span>
            ${iconOnly ? '' : 'Processing…'}
        `
        : `
            ${args.icon || iconOnly ? checkIcon : ''}
            ${iconOnly ? '' : escapeHtml(args.label)}
        `;

    return `
        <button
            type="button"
            class="${buttonClasses(args)}"
            ${disabledAttribute}
            ${busyAttribute}
            ${labelAttribute}
        >
            ${content}
        </button>
    `;
}

function preview(html: string, theme: Theme = 'light'): string {
    return `
        <section class="aui-docs-stage" data-theme="${theme}">
            <div class="aui-docs-row">
                ${html}
            </div>
        </section>
    `;
}

/**
 * The exact HTML displayed in each documentation example.
 *
 * These snippets are rendered by Storybook and reused as
 * copyable source code.
 */
const examples = {
    basic: `
<button type="button" class="btn">Continue</button>
`.trim(),

    sizes: `
<button type="button" class="btn btn-sm">Small</button>
<button type="button" class="btn btn-md">Medium</button>
<button type="button" class="btn btn-lg">Large</button>
`.trim(),

    solid: `
<button type="button" class="btn">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-error">Error</button>
`.trim(),

    outline: `
<button type="button" class="btn btn-outline">Primary</button>
<button type="button" class="btn btn-outline btn-secondary">Secondary</button>
<button type="button" class="btn btn-outline btn-success">Success</button>
<button type="button" class="btn btn-outline btn-warning">Warning</button>
<button type="button" class="btn btn-outline btn-error">Error</button>
`.trim(),

    ghost: `
<button type="button" class="btn btn-ghost">Primary</button>
<button type="button" class="btn btn-ghost btn-secondary">Secondary</button>
<button type="button" class="btn btn-ghost btn-success">Success</button>
<button type="button" class="btn btn-ghost btn-warning">Warning</button>
<button type="button" class="btn btn-ghost btn-error">Error</button>
`.trim(),

    smooth: `
<button type="button" class="btn btn-smooth">Primary</button>
<button type="button" class="btn btn-smooth btn-secondary">Secondary</button>
<button type="button" class="btn btn-smooth btn-success">Success</button>
<button type="button" class="btn btn-smooth btn-warning">Warning</button>
<button type="button" class="btn btn-smooth btn-error">Error</button>
`.trim(),

    shapes: `
<button type="button" class="btn">Default</button>
<button type="button" class="btn btn-pill">Pill</button>
<button type="button" class="btn btn-square" aria-label="Add item">
    <span aria-hidden="true">+</span>
</button>
<button type="button" class="btn btn-circle" aria-label="Close">
    <span aria-hidden="true">×</span>
</button>
`.trim(),

    block: `
<button type="button" class="btn btn-block">
    Full-width action
</button>
`.trim(),

    disabled: `
<button type="button" class="btn">Enabled</button>
<button type="button" class="btn" disabled>Disabled</button>
<button type="button" class="btn btn-outline" disabled>
    Disabled outline
</button>
`.trim(),

    loading: `
<button type="button" class="btn" disabled aria-busy="true">
    <span class="loading loading-spinner" aria-hidden="true"></span>
    Saving…
</button>
<span role="status" class="sr-only">Saving changes</span>
`.trim(),

    iconsAndLinks: `
<button type="button" class="btn">
    <span aria-hidden="true">✓</span>
    Confirm
</button>
<button type="button" class="btn btn-circle" aria-label="Add item">
    <span aria-hidden="true">+</span>
</button>
<a href="/account" class="btn btn-outline">View account</a>
`.trim(),

    themes: `
<div
    data-theme="light"
    style="padding: 24px; background: var(--aui-color-surface); color: var(--aui-color-text);"
>
    <button type="button" class="btn">Light</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
</div>
<div
    data-theme="dark"
    style="padding: 24px; background: var(--aui-color-surface); color: var(--aui-color-text);"
>
    <button type="button" class="btn">Dark</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
</div>
`.trim(),

    tokenCustomization: `
<div
    style="
        --aui-color-primary: #123456;
        --aui-color-primary-content: #ffffff;
        --aui-radius-control: 0.5rem;
    "
>
    <button type="button" class="btn">Custom primary</button>
</div>
`.trim(),

    utilityCustomization: `
<button
    type="button"
    class="btn bg-blue-800 text-white px-8 rounded-none"
>
    Utility override
</button>
`.trim(),
} as const;

const meta = {
    title: 'Components/Actions/Button',

    parameters: {
        layout: 'fullscreen',
    },

    args: initialArgs,

    argTypes: {
        label: {
            control: 'text',
        },
        theme: {
            control: 'select',
            options: ['light', 'dark'],
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'warning', 'error'],
        },
        variant: {
            control: 'select',
            options: ['solid', 'outline', 'ghost', 'smooth'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'md', 'lg'],
        },
        shape: {
            control: 'select',
            options: ['default', 'pill', 'square', 'circle'],
        },
        block: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        processing: {
            control: 'boolean',
        },
        icon: {
            control: 'boolean',
        },
    },
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<ButtonArgs>;

function documentedStory(html: string): Story {
    return {
        render: () => preview(html),

        parameters: {
            controls: {
                disable: true,
            },

            docs: {
                source: {
                    type: 'code',
                    language: 'html',
                    code: html,
                },
            },
        },
    };
}

/**
 * Documentation examples.
 */
export const Basic: Story = documentedStory(examples.basic);

export const Sizes: Story = documentedStory(examples.sizes);

export const Solid: Story = documentedStory(examples.solid);

export const Outline: Story = documentedStory(examples.outline);

export const Ghost: Story = documentedStory(examples.ghost);

export const Smooth: Story = documentedStory(examples.smooth);

export const Shapes: Story = documentedStory(examples.shapes);

export const Block: Story = documentedStory(examples.block);

export const Disabled: Story = documentedStory(examples.disabled);

export const Loading: Story = documentedStory(examples.loading);

export const IconsAndLinks: Story = documentedStory(examples.iconsAndLinks);

export const Themes: Story = documentedStory(examples.themes);

export const TokenCustomization: Story = documentedStory(examples.tokenCustomization);

export const UtilityCustomization: Story = documentedStory(examples.utilityCustomization);

/**
 * Exploratory story: intentionally separate from the
 * canonical copyable documentation examples.
 */
export const Interactive: Story = {
    render: (args) => preview(interactiveButton(args), args.theme),
};
