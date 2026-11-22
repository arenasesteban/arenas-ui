import plugin from 'tailwindcss/plugin';

import { themeStyles } from './styles/themes.js';

export default plugin(({ addBase, addComponents }) => {
    addBase(themeStyles);

    addComponents({
        '.aui-plugin-check': {
            outline: '2px dashed currentColor',
            outlineOffset: '4px',
        },
    });
});
