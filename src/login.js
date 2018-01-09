import React from 'react';
import axios from './axios.js';
import {Link} from 'react-router';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.email || !this.state.password) {
            this.setState({'error': true});
        } else {
            this.setState({'error': false});
            const {email, password} = this.state;
            const data = {email, password};
            axios.post('/login', data).then((resp) => {
                resp.data.success ? location.replace('/') : this.setState({'error': true});
            });
        }
    }
    render() {
        return (
            <div id='log-wrap'>
                <div id='logmv'>
                    <div id='login'>
                        <img id='log-img' src='/imgs/pleaselogin.png' alt='please login'/>
                        {this.state.error && <img id='wrong' src='/imgs/wrong.png' alt='something went wrong'/>}
                        <input onChange={this.handleChange} name="email" type="email" placeholder="email address" required></input>
                        <input onChange={this.handleChange} name="password" type="password" placeholder="password" required></input>
                        <button id='submit' onClick={this.handleSubmit} type="submit"></button>
                    </div>
                </div>
                <div id='reg-link'>
                    <div id='al-reg-wrap'><Link to='/'><img id='already-reg' src='/imgs/needtoreg.png' alt='need to register?'/></Link></div>
                </div>
            </div>
        )
    }
}
