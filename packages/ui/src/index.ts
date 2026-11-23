import plugin from 'tailwindcss/plugin';

import { buttonStyles } from './components/button/index.js';
import { loadingKeyframes, loadingStyles } from './components/loading/index.js';

import { themeStyles } from './styles/themes.js';

export default plugin(({ addBase, addComponents }) => {
    addBase(themeStyles);
    addBase(loadingKeyframes);

    addComponents({
        '.aui-plugin-check': {
            outline: '2px dashed currentColor',
            outlineOffset: '4px',
        },
    });

    addComponents(buttonStyles);
    addComponents(loadingStyles);
});
