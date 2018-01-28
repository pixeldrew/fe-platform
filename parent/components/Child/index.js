import React from 'react';
import PropTypes from 'prop-types';

import './styles/index.css';
import 'platform-theme/styles/components/Child/index.css';

const Child = ({message}) => (
    <div className={`child`}>{message}</div>
);

Child.propTypes = {
    message: PropTypes.string.isRequired
};

export default Child;
