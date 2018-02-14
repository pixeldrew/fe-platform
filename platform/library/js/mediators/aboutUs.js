import React from 'react';
import renderReact from '../utils/renderReact';
import {uniqBy} from 'lodash';

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

        // TODO: Create a babel plugin
        // Reads const _COMPONENTS={head:['<component id as string>'], body[]}
        // in this function (initReact) and adds the correct import statements at the beginning of the mediator
        // and converts:
        // const _COMPONENTS = { head: [], body: ['Child', 'Fetching'] }
        // to:

        const _COMPONENTS = {
            head: [],
            body: [
                {
                    Component: Parent,
                    id: 'Parent'
                },
                {
                    Component: Child,
                    id: 'Child'
                }
            ]
        };

        // Then adds this snipit to the page
        const {head, body} = _COMPONENTS;

        if (process.env.NODE_ENV === 'development') {

            const render = require('react-dom').render;
            const AppContainer = require('react-hot-loader').AppContainer;
            const Page = require('@carnival-abg/platform').Page;

            [...head, ...body].forEach(definition => {
                definition.properties = SR.components.data.find(model => model.type === definition.id) || {};
            });

            render(
                <AppContainer>
                    <Page headComponents={head} bodyComponents={body}/>
                </AppContainer>, document.querySelector('#main'));

        } else {

            uniqBy([...head, ...body], 'id').forEach(({Component, id}) => renderReact(Component, id));

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
