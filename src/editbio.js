import React from 'react';

export default class EditBio extends React.Component {
    constructor(props) {
        super(props),
        this.state = {}
    }
    render() {
        return (
            <div id='edit-bio-wrap'>
                <div id='edit-biomv'>
                    <div id='edit-bio'>
                    <textarea maxLength='399' onChange={this.props.handleBio} name="bio" placeholder="space bio">{this.props.bio || (this.props.error && 'i dont want a bio') || 'iPone'}</textarea>
                    <button onClick={this.props.submitBio}></button>
                    </div>
                </div>
            </div>
        )
    }
}
