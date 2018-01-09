import React from 'react';
import axios from './axios.js';
import {Link} from 'react-router';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.firstname || !this.state.lastname || !this.state.email || !this.state.password) {
            this.setState({'error': true});
        } else {
            this.setState({'error': false});
            const {firstname, lastname, email, password} = this.state;
            const data = {firstname, lastname, email, password};
            axios.post('/register', data).then((resp) => {
                resp.data.success ? location.replace('/') : this.setState({'error': true});
            });
        }
    }
    render() {
        return (
            <div id='reg-wrap'>
                <div id='move'>
                    <div id='reg-form'>
                        <img id='reg-img' src='/imgs/pleaseregister.png' alt='please register'/>
                        {this.state.error && <img id='wrong' src='/imgs/wrong.png' alt='something went wrong'/>}
                        <input onChange={this.handleChange} name="firstname" type="text" placeholder="first name" required></input>
                        <input onChange={this.handleChange} name="lastname" type="text" placeholder="last name" required></input>
                        <input onChange={this.handleChange} name="email" type="email" placeholder="email address" required></input>
                        <input onChange={this.handleChange} name="password" type="password" placeholder="password" required></input>
                        <button id='submit' onClick={this.handleSubmit} type="submit"></button>
                    </div>
                </div>
                <div id='reg-link'>
                    <div id='al-reg-wrap'><Link to='/login'><img id='already-reg' src='/imgs/alreadyregistered.png' alt='already registered?'/></Link></div>
                </div>
            </div>
        )
    }
}
