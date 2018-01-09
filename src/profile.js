import React from 'react';
import axios from 'axios';

export default class Profile extends React.Component {
    constructor(props) {
        super(props),
        this.state = {}
    }
    render() {
        return (
            <div id='your-profile'>
                <div className='prof-name-wrap'>
                    <h1 className='prof-name'>{this.props.firstname} {this.props.lastname}</h1>
                </div>
                <div className='prof-pic-wrap'>
                    <img className='prof-pic' onClick={this.props.toggleUploader} src={this.props.profilePic} alt={this.props.firstname}/>
                </div>
                <div className='edit-bio-q-wrap'>
                    <div className='edit-bio-q'>
                        <div className='prof-bio'>
                            {this.props.bio && <p>{this.props.bio}</p>}
                            {!this.props.bio && <p>add a bio you space freak</p>}
                        </div>
                    </div>
                    <div className='change-bio-but-wrap'>
                        <button className='change-bio-but' onMouseDown={this.props.toggleBioEdit}></button>
                    </div>
                </div>
            </div>
        )
    }
}
