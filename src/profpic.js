import React from 'react';
import {Link} from 'react-router';

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <div id='prof-pic-wrap'>
                    <Link to='/'><img id='prof-pic' src={this.props.profilePic} alt={this.props.firstname}/></Link>
                </div>
            </div>
        )
    }
}
