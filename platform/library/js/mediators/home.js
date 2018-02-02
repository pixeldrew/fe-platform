/* global SR */
import React from 'react';
import renderReact from '../utils/renderReact';

import 'platform-theme/styles/pages/home/index.css';

import {uniqBy} from 'lodash';

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
        // Reads const _COMPONENTS={head:['<component id as string>'], body[]}
        // in this function (initReact) and adds the correct import statements at the beginning of the mediator
        // and converts:
        // const _COMPONENTS = { head: [], body: ['Child', 'Fetching'] }
        // to:

        const _COMPONENTS = {
            head: [],
            body: [
                {id: 'Child', Component: Child},
                {id: 'Fetching', Component: Fetching}
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

// Add this snipit by babel plugin '@carnival-abg/platform' should be <PACKAGE_NAME>
if (module.hot) {
    module.hot.accept(['@carnival-abg/platform'], () => {
        mediator.initReact();
    });
}
