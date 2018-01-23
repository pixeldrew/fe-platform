import React from 'react';
import PropTypes from 'prop-types';

import 'css/components/Child/index.css';
import 'theme/css/components/Child/index.css';

const Child = ({message}) => (
    <div className={`child`}>{message}</div>
);

Child.propTypes = {
    message: PropTypes.string.isRequired
};

export default Child;
