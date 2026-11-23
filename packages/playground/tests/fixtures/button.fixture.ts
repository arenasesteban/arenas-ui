import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./browser.generated.css', import.meta.url), 'utf8');

export const roles = ['primary', 'secondary', 'success', 'warning', 'error'] as const;

export const semanticRoles = ['success', 'warning', 'error'] as const;

export const variants = ['default', 'outline', 'ghost', 'smooth'] as const;

const states = ['enabled', 'disabled', 'processing'] as const;

type Theme = 'light' | 'dark';
type Role = (typeof roles)[number];
type Variant = (typeof variants)[number];
type State = (typeof states)[number];

function buttonClass(role: Role, variant: Variant): string {
    return [
        'btn',
        role === 'primary' ? '' : `btn-${role}`,
        variant === 'default' ? '' : `btn-${variant}`,
    ]
        .filter(Boolean)
        .join(' ');
}

function buttonId(theme: Theme, role: Role, variant: Variant, state: State): string {
    if (state !== 'enabled') {
        return `${theme}-${role}-${variant}-${state}`;
    }

    return variant === 'default' ? `${theme}-${role}` : `${theme}-${role}-${variant}`;
}

function renderButton(theme: Theme, role: Role, variant: Variant, state: State): string {
    const id = buttonId(theme, role, variant, state);
    const className = buttonClass(role, variant);

    const attributes =
        state === 'enabled' ? '' : state === 'disabled' ? 'disabled' : 'disabled aria-busy="true"';

    const spinner =
        state === 'processing'
            ? '<span class="loading loading-spinner" aria-hidden="true"></span>'
            : '';

    const label =
        state === 'enabled'
            ? `${role} ${variant}`
            : state === 'disabled'
              ? 'Disabled'
              : 'Processing';

    return `
        <button
            id="${id}"
            type="button"
            class="${className}"
            ${attributes}
        >
            ${spinner}
            ${label}
        </button>
    `;
}

function renderThemeButtons(theme: Theme): string {
    return roles
        .flatMap((role) =>
            variants.flatMap((variant) =>
                states.map((state) => renderButton(theme, role, variant, state)),
            ),
        )
        .join('');
}

export const buttonFixture = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Arenas UI Button Tests</title>

        <style>${css}</style>

        <style>
            .demo {
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                gap: 1rem;
                padding: 2rem;
                background: var(--aui-color-surface);
                color: var(--aui-color-text);
            }
        </style>
    </head>

    <body>
        <main>
            <h1>Arenas UI Button Tests</h1>

            <section
                id="light"
                class="demo"
                data-theme="light"
            >
                <h2>Light theme</h2>

                ${renderThemeButtons('light')}

                <button
                    id="combined"
                    type="button"
                    class="btn btn-success btn-outline btn-lg"
                >
                    Save
                </button>

                <button
                    id="small"
                    type="button"
                    class="btn btn-sm"
                >
                    Small
                </button>

                <button
                    id="medium"
                    type="button"
                    class="btn btn-md"
                >
                    Medium
                </button>

                <button
                    id="large"
                    type="button"
                    class="btn btn-lg"
                >
                    Large
                </button>

                <button
                    id="pill"
                    type="button"
                    class="btn btn-pill"
                >
                    Pill
                </button>

                <button
                    id="square"
                    type="button"
                    class="btn btn-square"
                    aria-label="Open menu"
                >
                    <span aria-hidden="true">☰</span>
                </button>

                <button
                    id="circle"
                    type="button"
                    class="btn btn-circle"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>

                <button
                    id="block"
                    type="button"
                    class="btn btn-block"
                >
                    Full width
                </button>

                <button
                    id="loading-visual"
                    type="button"
                    class="btn"
                >
                    <span
                        class="loading loading-spinner"
                        aria-hidden="true"
                    ></span>
                    Saving
                </button>

                <span
                    id="standalone-spinner"
                    class="loading loading-spinner"
                    role="status"
                    aria-label="Loading"
                ></span>

                <button
                    id="utility"
                    type="button"
                    class="btn bg-blue-800 text-white px-8 rounded-none"
                >
                    Customized
                </button>

                <div
                    id="utility-reference"
                    class="bg-blue-800 px-8 rounded-none"
                    aria-hidden="true"
                ></div>

                <a
                    id="link"
                    class="btn btn-outline"
                    href="#destination"
                >
                    Read more
                </a>
            </section>

            <section
                id="dark"
                class="demo"
                data-theme="dark"
            >
                <h2>Dark theme</h2>

                ${renderThemeButtons('dark')}
            </section>

            <section
                id="custom"
                class="demo"
                style="
                    --aui-color-primary: #123456;
                    --aui-color-primary-content: #ffffff;
                "
            >
                <h2>Custom theme</h2>

                <button
                    id="custom-button"
                    type="button"
                    class="btn"
                >
                    Customized tokens
                </button>
            </section>

            <div id="destination"></div>
        </main>
    </body>
</html>
`;
