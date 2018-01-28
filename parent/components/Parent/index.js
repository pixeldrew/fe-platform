import React from 'react';
import {Child} from '@carnival-abg/platform';

const Parent = () => (
    <div className={`parent`}>
        <Child message={`I am a child`}/>
    </div>
);

Parent.propTypes = {};

export default Parent;
