import React from 'react';
import axios from './axios.js';

export default class UploadProfPic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        return (
            <div id='update-prof-wrap'>
                <div id='update-profmv'>
                    <div id='update-prof'>
                        {this.state.error && <h3>oh oh you done goofed son</h3>}
                        <div id='hide-input'>
                            <img src='/imgs/choosefile.png'/>
                            <input onChange={this.props.handleChange} type="file" name="image"></input>
                        </div>
                        <button id='sub-prof' onClick={this.props.handleSubmit} type="submit" name="button"></button>
                    </div>
                </div>
            </div>
        )
    }
}
