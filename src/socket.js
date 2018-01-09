import {store} from './start.js';
import * as io from 'socket.io-client';
import axios from './axios.js';
import {getOnlineUsers, addNewUser, userDisconnected, showNewMessage, yourNotAlone, yourGotRejected, yourGotTerminated} from './actions.js';

let socket;

export function getSocket() {
    if (!socket) {
        socket = io.connect();
        socket.on('connect', () => {
            axios.get(`/connected/${socket.id}`).then(({data}) => {
                console.log(data);
                data.success ? console.log('boom') : console.log('uh oh')
            })
        })
    }
    socket.on('userJoined', data => {
        store.dispatch(getOnlineUsers(data));
    })
    socket.on('newUserOnline', data => {
        store.dispatch(addNewUser(data));
    })
    socket.on('userDisconnected', data => {
        store.dispatch(userDisconnected(data));
    })
    socket.on('newMessage', data => {
        store.dispatch(showNewMessage(data));
    })
    socket.on('yourNotAlone', data => {
        store.dispatch(yourNotAlone(data));
    })
    socket.on('yourGotRejected', data => {
        store.dispatch(yourGotRejected(data));
    })
    socket.on('yourGotTerminated', data => {
        store.dispatch(yourGotTerminated(data));
    })
    return socket;
}
