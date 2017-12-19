import React from 'react';

import 'css/pages/homePage/index.css';

import { TestComponent } from 'carnival';

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
            const Page = require('components/Page').default;

            const headComponents = [];
            const bodyComponents = [{Component: TestComponent, properties:{attributes:{message: 'yo'}, component: 'TestComponent'}}];

            render(
                <AppContainer>
                    <Page headComponents={headComponents} bodyComponents={bodyComponents}/>
                </AppContainer>, document.querySelector('#main'));

        } else {
            renderReact(TestComponent, 'testComponent');
        }
    }

};

mediator.init();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept(['components/Page', 'carnival'], () => {
        mediator.init()
    })
}