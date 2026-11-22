import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('./plugin.generated.css', import.meta.url), 'utf8');

test('registers the Arenas UI integration selector', () => {
    assert.match(css, /\.aui-plugin-check\s*\{/);
    assert.match(css, /outline:\s*2px dashed currentColor/);
    assert.match(css, /outline-offset:\s*4px/);
});

test('compiles standard Tailwind utilities', () => {
    assert.match(css, /\.font-bold\s*\{/);
});

test('registers theme tokens and media preferences', () => {
    assert.match(css, /--aui-color-primary/);
    assert.match(css, /--aui-color-focus/);
    assert.match(css, /prefers-color-scheme:\s*dark/);
    assert.match(css, /data-theme/);
});
