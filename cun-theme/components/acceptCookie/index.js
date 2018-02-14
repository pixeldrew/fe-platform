/* eslint no-invalid-this: [0], no-console: [0] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles/index.css';

class GenericAcceptCookies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: 0
        };
    }

    selectRadio = ({selected}) => {
        this.setState({selected});
    }

    render() {
        return this.props.children(this.selectRadio, this.state);
    }
}

GenericAcceptCookies.propTypes = {
    children: PropTypes.func.isRequired
};

const AcceptCookies = ({id}) => (
    <div className="accept-cookie">
        <GenericAcceptCookies>
            {(selectRadio, {selected}) => (
                <button value={'whatever'} onClick={selectRadio.bind(null, {selected: id})} >Click Me { selected }</button>
            )}
        </GenericAcceptCookies>
    </div>
);

AcceptCookies.propTypes = {
    id: PropTypes.string
};

AcceptCookies.defaultProps = {
    id: '30'
};

export default AcceptCookies;

