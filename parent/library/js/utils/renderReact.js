import React from 'react';
import {render} from 'react-dom';

const componentData = SR.components.data;

const renderReact = (Component, key) => {

    Array.prototype.map.call(
        document.querySelectorAll(`[data-type="${ key }"]`),
        el => {

            const props = componentData.filter(cmp => cmp.id === el.getAttribute('data-id'))[0];

            if (props && props.attributes) {

                const services = props.services || [];
                const type = props.type || '';

                render(<Component {...props.attributes} services={services} component={type}/>, el);
            }
        }
    );
};

export default renderReact;
