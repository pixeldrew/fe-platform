import React from 'react';
import Child from '../Child';

const Unused = () => (<div>I am not <Child message={`used`} /> </div>);

Unused.propTypes = {};

export default Unused;
