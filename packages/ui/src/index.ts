import plugin from 'tailwindcss/plugin';

import { buttonKeyframes, buttonStyles } from './components/button/index.js';

import { themeStyles } from './styles/themes.js';

export default plugin(({ addBase, addComponents }) => {
    addBase(themeStyles);
    addBase(buttonKeyframes);

    addComponents({
        '.aui-plugin-check': {
            outline: '2px dashed currentColor',
            outlineOffset: '4px',
        },
    });

    addComponents(buttonStyles);
});
