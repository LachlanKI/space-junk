import axios from './axios.js';

export function getFriends() {
    return axios.get('/getFriends').then(({data}) => {
        return {
            type: 'GET_FRIENDS',
            friends: data.friends,
            id: data.id
        };
    });
}

export function getOnlineUsers(data) {
    console.log('pls', data);
        return {
            type: 'GET_ONLINE_USERS',
            onlineUsers: data.users,
            id: data.id
        };
    };

export function addNewUser(data) {
    return {
        type: 'ADD_NEW_USER',
        newUser: data
    }
}

export function userDisconnected(data) {
    return {
        type: 'USER_DISCONNECTED',
        disUser: data
    }
}

export function sendFriendRequest(ouId, status) {
    return axios.post('/sendFriendRequest', {
        otherId: ouId,
        status: status
    }).then(({data}) => {
        return {
            type: 'SEND_FRIEND_REQ',
            friendStatus: data.status,
            sender_id: data.sender_id,
            recipient_id: data.recipient_id,
            ouId: ouId
        };
    });
}

export function cancelFriendRequest(ouId) {
    return axios.post('/cancelFriendRequest', {
        otherId: ouId
    }).then(({data}) => {
        return {
            type: 'CANCEL_FRIEND_REQ',
            friendStatus: data.status,
            sender_id: data.sender_id,
            recipient_id: data.recipient_id,
            ouId: ouId
        };
    });
}

export function acceptFriendRequest(ouId) {
    return axios.post('/acceptFriendRequest', {
        otherId: ouId
    }).then(({data}) => {
        return {
            type: 'ACCEPT_FRIEND_REQ',
            friendStatus: data.status,
            sender_id: data.sender_id,
            recipient_id: data.recipient_id,
            ouId: ouId
        };
    });
}

export function terminateFriendRequest(ouId) {
    return axios.post('/terminateFriendRequest', {
        otherId: ouId
    }).then(({data}) => {
        return {
            type: 'TERMINATE_FRIEND_REQ',
            friendStatus: data.status,
            sender_id: data.sender_id,
            recipient_id: data.recipient_id,
            ouId: ouId
        };
    });
}

export function rejectFriendRequest(ouId) {
    return axios.post('/rejectFriendRequest', {
        otherId: ouId
    }).then(({data}) => {
        return {
            type: 'REJECT_FRIEND_REQ',
            friendStatus: data.status,
            sender_id: data.sender_id,
            recipient_id: data.recipient_id,
            ouId: ouId
        };
    });
}

export function logMessage(id, message) {
    return axios.post('/logMessage', {id, message}).then(({data}) => {
        if (data.success) {
            return {
                type: 'MESSAGE_LOGGED'
            }
        }
    })
}

export function yourNotAlone(data) {
    console.log('your not alone data');
    return {
        type: 'YOUR_NOT_ALONE',
        info: data
    }
}

export function yourGotRejected(data) {
    console.log('your not alone data');
    return {
        type: 'YOUR_GOT_REJECTED',
        info: data
    }
}

export function yourGotTerminated(data) {
    console.log('your not alone data');
    return {
        type: 'YOUR_GOT_TERMINATED',
        info: data
    }
}

export function showNewMessage(data) {
    console.log('data pls!!!!!!!!!!!!', data);
    return {
        type: 'SHOW_NEW_MESSAGE',
        message: data
    }
}

export function getLast10Messages() {
    return axios.get('/getLast10Messages').then(({data}) => {
        return {
            type: 'LAST_10_MESSAGES',
            messages: data.messages
        }
    })
}
