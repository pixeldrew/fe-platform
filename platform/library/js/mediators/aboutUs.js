import React from 'react';
import renderReact from '../utils/renderReact';

import 'platform-theme/styles/pages/aboutUs/index.css';

import {Parent, Child} from '@carnival-abg/platform';

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
            const Page = require('../../../components/Page').default;

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
    module.hot.accept(['../../../components/Page', '@carnival-abg/platform'], () => {
        mediator.init();
    });
}
