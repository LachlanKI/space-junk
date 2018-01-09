import React from 'react';
import Logo from './logo.js';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Logo />
                {this.props.children}
            </div>
        )
    }
}
