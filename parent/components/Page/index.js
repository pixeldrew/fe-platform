import React from 'react';
import PropTypes from 'prop-types';

const outputComponent = ({Component, properties}, i) => {

    const {attributes, services, type} = properties;

    return (
        <Component key={`comp-${i}`} {...attributes} services={services} component={type}/>
    );
};

outputComponent.propTypes = {
    Component: PropTypes.element.isRequired,
    properties: PropTypes.object.isRequired
};

const Page = ({headComponents, bodyComponents}) => (
    <div className="wrapper">
        <div className="alert-header-wrapper">
            {headComponents.map(outputComponent)}
        </div>
        {bodyComponents.map(outputComponent)}
    </div>
);

Page.propTypes = {
    headComponents: PropTypes.array.isRequired,
    bodyComponents: PropTypes.array.isRequired
};

export default Page;
