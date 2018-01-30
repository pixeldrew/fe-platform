import React from 'react';
import renderReact from '../utils/renderReact';

import 'platform-theme/styles/pages/homePage/index.css';

import {Child, Fetching} from '@carnival-abg/platform';

const mediator = {
    init() {
        this.initUI();
    },

    initUI() {
        this.initReact();
    },

    initReact() {

        // TODO: Create a babel plugin
        // Reads const TEMPLATE_COMPONENTS={head:['@carnival-abg/platform/Navigation'], body[]}
        // in this mediator.initReact and adds the correct import statements at the beginning of this file
        // then if NODE_ENV === development construct the following template else add the renderReact portions

        if (process.env.NODE_ENV === 'development') {

            const render = require('react-dom').render;
            const AppContainer = require('react-hot-loader').AppContainer;
            const Page = require('components/Page').default;

            const head = [];
            const body = [
                {
                    Component: Child,
                    properties: {attributes: {message: 'this is the home page'}, component: 'Child'}
                },
                {
                    Component: Fetching,
                    properties: {}
                }
            ];

            render(
                <AppContainer>
                    <Page headComponents={head} bodyComponents={body}/>
                </AppContainer>, document.querySelector('#main'));

        } else {
            renderReact(Child, 'child');
        }
    }

};

mediator.init();

// TODO: add this snippit by babel plugin
if (module.hot) {
    module.hot.accept(['components/Page', '@carnival-abg/platform'], () => {
        mediator.init();
    });
}
