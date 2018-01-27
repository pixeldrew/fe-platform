import React, {Component} from 'react';

const PRETTY = 4;

export default class Fetching extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json: null
        };
    }

    async gotSomething() {
        const response = await fetch('https://httpbin.org/anything', {credentials: false});
        // testing object rest spread
        const {headers, ...json} = await response.json();

        this.setState({json, headers});
    }

    componentDidMount() {
        this.gotSomething();
    }

    render() {
        return (<div>Something Async <pre>{JSON.stringify(this.state.json, null, PRETTY)}</pre></div>);
    }
}
