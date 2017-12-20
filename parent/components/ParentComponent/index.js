import React from 'react';
import TestComponent from '../TestComponent';

const ParentComponent = () => (
    <div className={`parent`}>
        <TestComponent message={`hello`}/>
    </div>
);

ParentComponent.propTypes = {};

export default ParentComponent;
