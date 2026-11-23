import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./browser.generated.css', import.meta.url), 'utf8');

export const roles = ['primary', 'secondary', 'success', 'warning', 'error'] as const;

export const semanticRoles = ['success', 'warning', 'error'] as const;

export const presentations = ['outline', 'ghost'] as const;

type Theme = 'light' | 'dark';

function roleButtons(theme: Theme): string {
    return roles
        .map((role) => {
            const modifier = role === 'primary' ? '' : ` btn-${role}`;

            return `
                <button
                    id="${theme}-${role}"
                    type="button"
                    class="btn${modifier}"
                >
                    ${role}
                </button>
            `;
        })
        .join('');
}

function semanticPresentationButtons(theme: Theme): string {
    return semanticRoles
        .flatMap((role) =>
            presentations.map(
                (presentation) => `
                    <button
                        id="${theme}-${role}-${presentation}"
                        type="button"
                        class="btn btn-${role} btn-${presentation}"
                    >
                        ${role} ${presentation}
                    </button>
                `,
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

                ${roleButtons('light')}
                ${semanticPresentationButtons('light')}

                <button
                    id="outline"
                    type="button"
                    class="btn btn-outline"
                >
                    Outline
                </button>

                <button
                    id="ghost"
                    type="button"
                    class="btn btn-ghost"
                >
                    Ghost
                </button>

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
                    class="btn btn-loading"
                >
                    Saving
                </button>

                <button
                    id="loading-managed"
                    type="button"
                    class="btn btn-loading"
                    disabled
                    aria-busy="true"
                >
                    Saving
                </button>

                <button
                    id="disabled"
                    type="button"
                    class="btn"
                    disabled
                >
                    Disabled
                </button>

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

                ${roleButtons('dark')}
                ${semanticPresentationButtons('dark')}

                <button
                    id="dark-outline"
                    type="button"
                    class="btn btn-warning btn-outline"
                >
                    Outline warning
                </button>

                <button
                    id="dark-ghost"
                    type="button"
                    class="btn btn-error btn-ghost"
                >
                    Ghost error
                </button>
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
