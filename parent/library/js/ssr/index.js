/* eslint-disable new-cap */
/* eslint-disable no-undef */
import './polyfill';
import {createFactory} from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

import * as platform from '@carnival-abg/platform';

const render = props => {

    props = JSON.parse(props);

    const Component = createFactory(platform[props.type]);
    const fn = props.meta.render === 'serverside' ? renderToStaticMarkup : renderToString;

    return fn(Component(props.attributes));
};

export default platform;
export { render };
