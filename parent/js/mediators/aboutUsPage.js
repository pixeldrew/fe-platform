import React from 'react';
import renderReact from '../utils/renderReact';

import 'css/pages/aboutUsPage/index.css';

import {ParentComponent} from 'carnival';

const aboutUsPage = {
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
            const Page = require('components/Page').default;

            const headComponents = [];
            const bodyComponents = [{
                Component: ParentComponent,
                properties: {attributes: {message: 'yo'}, component: 'ParentComponent'}
            }];

            render(
                <AppContainer>
                    <Page headComponents={headComponents} bodyComponents={bodyComponents}/>
                </AppContainer>, document.querySelector('#main'));

        } else {
            renderReact(ParentComponent, 'parentComponent');
        }
    }

};

aboutUsPage.init();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept(['components/Page', 'carnival'], () => {
        aboutUsPage.init();
    });
}

export default aboutUsPage;
