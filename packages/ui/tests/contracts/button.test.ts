import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const css = readFileSync(new URL('../fixtures/plugin.generated.css', import.meta.url), 'utf8');

const buttonClasses = [
    'btn',
    'btn-outline',
    'btn-ghost',
    'btn-smooth',
    'btn-secondary',
    'btn-success',
    'btn-warning',
    'btn-error',
    'btn-sm',
    'btn-md',
    'btn-lg',
    'btn-pill',
    'btn-square',
    'btn-circle',
    'btn-block',
];

const loadingClasses = ['loading', 'loading-spinner'];

function assertGeneratedClasses(classes: string[]): void {
    for (const className of classes) {
        assert.match(
            css,
            new RegExp(`\\.${className}\\s*\\{`),
            `Missing generated class: .${className}`,
        );
    }
}

test('Tailwind generates the public Button classes', () => {
    assertGeneratedClasses(buttonClasses);
});

test('Tailwind generates the public Loading classes', () => {
    assertGeneratedClasses(loadingClasses);
});
