import plugin from 'tailwindcss/plugin';

export default plugin(({ addComponents }) => {
    addComponents({
        '.aui-plugin-check': {
            outline: '2px dashed currentColor',
            outlineOffset: '4px',
        },
    });
});
