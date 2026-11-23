import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const css = readFileSync(new URL('../fixtures/plugin.generated.css', import.meta.url), 'utf8');

const publicClasses = [
    'btn',
    'btn-outline',
    'btn-ghost',
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
    'btn-loading',
];

test('Tailwind generates every public Button class', () => {
    for (const name of publicClasses) {
        assert.ok(css.includes(`.${name}`), `Missing generated selector: .${name}`);
    }
});

test('Button styles resolve public theme tokens', () => {
    for (const token of [
        '--aui-color-primary',
        '--aui-color-primary-content',
        '--aui-color-primary-emphasis',
        '--aui-color-secondary-emphasis',
        '--aui-color-success-emphasis',
        '--aui-color-warning-emphasis',
        '--aui-color-error-emphasis',
        '--aui-color-focus',
        '--aui-radius-control',
        '--aui-control-height',
        '--aui-control-padding-inline',
        '--aui-motion-duration-control',
        '--aui-motion-easing-control',
    ]) {
        assert.ok(css.includes(token), `Missing token: ${token}`);
    }
});

test('Button includes native states and loading animation', () => {
    assert.match(css, /:focus-visible/);
    assert.match(css, /:disabled/);
    assert.match(css, /:hover/);
    assert.match(css, /:active/);
    assert.match(css, /aui-button-spin/);
    assert.match(css, /prefers-reduced-motion/);
});

test('Button generates the visual interaction contract', () => {
    for (const property of [
        '--_aui-btn-border',
        '--_aui-btn-hover-background',
        '--_aui-btn-active-background',
        '--_aui-btn-emphasis',
        '--_aui-btn-height',
        '--_aui-btn-padding',
    ]) {
        assert.ok(css.includes(property), `Missing Button property: ${property}`);
    }

    assert.match(css, /color-mix\(/);
    assert.match(css, /transition:/);

    assert.match(css, /var\(--aui-motion-duration-control/);
    assert.match(css, /var\(--aui-motion-easing-control/);
});
