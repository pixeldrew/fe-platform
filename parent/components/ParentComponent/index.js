import React from 'react';
import TestComponent from '../TestComponent';

export default ({message}) => (
    <div className={`parent`}>
        <TestComponent message={`hello`}/>
    </div>
);