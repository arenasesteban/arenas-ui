import type { Preview } from '@storybook/html-vite';

import '../src/styles/storybook.css';

const preview: Preview = {
    parameters: {
        layout: 'fullscreen',

        controls: {
            expanded: true,
        },

        docs: {
            toc: {
                headingSelector: 'h2',
            },
        },
    },
};

export default preview;
