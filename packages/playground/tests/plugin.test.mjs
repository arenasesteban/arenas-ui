import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { URL } from 'node:url';

const css = readFileSync(new URL('./plugin.generated.css', import.meta.url), 'utf8');

test('Arenas UI registers its integration selector', () => {
    assert.match(css, /\.aui-plugin-check\s*\{/);
    assert.match(css, /outline:\s*2px dashed currentColor/);
    assert.match(css, /outline-offset:\s*4px/);
});

test('standard Tailwind utilities compile alongside Arenas UI', () => {
    assert.match(css, /\.font-bold\s*\{/);
});
