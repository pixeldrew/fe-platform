import React from 'react';

const outputComponent = ({Component, properties}, i) => {

    const {attributes, services, type} = properties;

    return (
        <Component key={`comp-${i}`} {...attributes} services={services} component={type}/>
    );
};


const Page = ({headComponents, bodyComponents}) => (
    <div className="wrapper">
        <div className="alert-header-wrapper">
            {headComponents.map(outputComponent)}
        </div>
        {bodyComponents.map(outputComponent)}
    </div>
);

export default Page;
