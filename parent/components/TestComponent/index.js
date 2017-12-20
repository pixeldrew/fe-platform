import React from 'react';
import PropTypes from 'prop-types';

const TestComponent = ({message}) => (
    <div className={`title hello`}>{message}</div>
);

TestComponent.propTypes = {
    message: PropTypes.string.isRequired
};

export default TestComponent;
