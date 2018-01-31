import React from 'react';
import renderReact from '@carnival-abg/platform/dist/library/js/utils/renderReact';

import 'cun-theme/styles/pages/aboutUs/index.css';

import {Parent} from '@carnival-abg/platform';
import {Child} from '@carnival-abg/cun';

const mediator = {
    init() {
        this.initUI();
    },

    initUI() {
        this.initReact();
    },

    initReact() {

        if (process.env.NODE_ENV === 'development') {

            const render = require('react-dom').render;
            const AppContainer = require('react-hot-loader').AppContainer;
            const Page = require('@carnival-abg/platform/dist/components/Page').default;

            const headComponents = [];
            const bodyComponents = [
                {
                    Component: Parent,
                    properties: {attributes: {message: 'this is the about us page'}, component: 'Parent'}
                },
                {
                    Component: Child,
                    properties: {attributes: {message: 'a second child'}, component: 'Child'}
                }
            ];

            render(
                <AppContainer>
                    <Page headComponents={headComponents} bodyComponents={bodyComponents}/>
                </AppContainer>, document.querySelector('#main'));

        } else {
            renderReact(Parent, 'parent');
        }
    }

};

mediator.init();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept(['@carnival-abg/cun'], () => {
        mediator.init();
    });
}
