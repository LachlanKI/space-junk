import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory, browserHistory, Redirect} from 'react-router';
import Welcome from './welcome.js';
import Register from './register.js';
import Login from './login.js';
import App from './app.js';
import Profile from './profile.js';
import OtherUser from './otheruser.js';
import {createStore, applyMiddleware} from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducer.js';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux';
import Friends from './friends.js';
import {getSocket} from './socket.js';
import WhosOnline from './whosOnline.js';
import Chatroom from './chatroom.js';
export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

const notLogged = (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome}>
            <Route path='/login' component={Login} />
            <IndexRoute component={Register} />
            <Redirect from='*' to='/' />
        </Route>
    </Router>
);

let router;
if (location.pathname == '/welcome') {
    router = notLogged;
} else {
    getSocket();
    const logged = (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route path='/friends' component={Friends} />
                    <Route path='/user/:id' component={OtherUser} />
                    <Route path='/whosonline' component={WhosOnline} />
                    <Route path='/chatroom' component={Chatroom} />
                    <IndexRoute component={Profile} />
                    <Redirect from='*' to='/' />
                </Route>
            </Router>
        </Provider>
    );
    router = logged;
}

ReactDOM.render(router, document.querySelector('main'));
