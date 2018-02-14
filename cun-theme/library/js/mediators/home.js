import React from 'react';
import {uniqBy} from 'lodash';

import renderReact from '@carnival-abg/platform/library/js/utils/renderReact';

import 'cun-platform-theme/styles/pages/home/index.css';

import {AcceptCookie} from '@carnival-abg/cun-platform';
import {Parent} from '@carnival-abg/platform';

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
                {id: 'Parent', Component: Parent},
                {id: 'AcceptCookie', Component: AcceptCookie}
            ]
        };

        // Then adds this snipit to the page
        const {head, body} = _COMPONENTS;

        if (process.env.NODE_ENV === 'development') {

            const render = require('react-dom').render;
            const Page = require('@carnival-abg/platform').Page;
            const AppContainer = require('react-hot-loader').AppContainer;

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
    module.hot.accept(['@carnival-abg/cun-platform', '@carnival-abg/platform'], () => {
        mediator.init();
    });
}
