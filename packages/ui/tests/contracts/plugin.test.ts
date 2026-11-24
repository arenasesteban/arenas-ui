import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const css = readFileSync(new URL('../fixtures/plugin.generated.css', import.meta.url), 'utf8');

test('Tailwind loads the Arenas UI plugin', () => {
    assert.match(css, /\.aui-plugin-check\s*\{/);
});

test('plugin styles and Tailwind utilities are generated', () => {
    assert.match(css, /outline:\s*2px dashed currentColor/);
    assert.match(css, /outline-offset:\s*4px/);
    assert.match(css, /\.font-bold\s*\{/);
});
