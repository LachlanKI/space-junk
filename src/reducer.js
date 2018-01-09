export default function reducer(state = {}, action) {
    if (action.type == 'GET_FRIENDS') {
        state = Object.assign({}, state, {
            friends: action.friends,
            id: action.id
        });
    }

    if (action.type == 'GET_ONLINE_USERS') {
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers,
            id: action.id
        });
    }

    if (action.type == 'SHOW_NEW_MESSAGE') {
        if (!state.messages) {
            state = Object.assign({}, state, {
                messages: [action.message]
            })
        } else {
            state = Object.assign({}, state, {
                messages: state.messages.concat(action.message)
            })
        }
    }

    if (action.type == 'LAST_10_MESSAGES') {
        state = Object.assign({}, state, {
            messages: action.messages
        })
    }

    if (action.type == 'MESSAGE_LOGGED') {
        // state = Object.assign({}, state, {
        //     message: action.message
        // })
    }

    if (action.type == 'YOUR_NOT_ALONE') {
        state = Object.assign({}, state, {
            notification: action.info
        })
    }

    if (action.type == 'YOUR_GOT_REJECTED') {
        state = Object.assign({}, state, {
            notification: action.info
        })
    }

    if (action.type == 'YOUR_GOT_TERMINATED') {
        state = Object.assign({}, state, {
            notification: action.info
        })
    }

    if (action.type == 'ADD_NEW_USER') {
        if (!state.onlineUsers) {
            return state;
        } else {
            let x = state.onlineUsers.some(user => user.id == action.newUser.id)
            if (x) {
                return state;
            } else {
                state = Object.assign({}, state, {
                    onlineUsers: state.onlineUsers.concat(action.newUser),
                    update: {
                        user: action.newUser,
                        type: 'join'
                    }
                })
            }
        }
    }

    if (action.type == 'USER_DISCONNECTED') {
        if (!state.onlineUsers) {
            return state;
        } else {
            let indx;
            state.onlineUsers.forEach((user, pos) => {
                if (user.id == action.disUser) {
                    indx = pos;
                }
            })
            state =  Object.assign({}, state, {
                onlineUsers: state.onlineUsers.filter(user => user.id != action.disUser),
                update: {
                    user:state.onlineUsers.splice(indx, 1)[0],
                    type: 'left'
                }
            })
        }
    }

    if (action.type == 'SEND_FRIEND_REQ') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.ouId == action.ouId) {
                    return Object.assign({}, friend, {
                        status: 1,
                        sender_id: action.sender_id,
                        recipient_id: action.recipient_id
                    })
                }
                return friend;
            })
        });
    }

    if (action.type == 'CANCEL_FRIEND_REQ') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.ouId == action.ouId && friend.status == 1) {
                    return Object.assign({}, friend, {
                        status: 3
                    })
                }
                return friend;
            })
        });
    }

    if (action.type == 'ACCEPT_FRIEND_REQ') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.ouId == action.ouId && friend.status == 1) {
                    return Object.assign({}, friend, {
                        status: 2
                    })
                }
                return friend;
            })
        })
    }

    if (action.type == 'REJECT_FRIEND_REQ') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.ouId == action.ouId && friend.status == 1) {
                    return Object.assign({}, friend, {
                        status: 5
                    })
                }
                return friend;
            })
        });
    }

    if (action.type == 'TERMINATE_FRIEND_REQ') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.ouId == action.ouId && friend.status == 2) {
                    return Object.assign({}, friend, {
                        status: 4
                    })
                }
                return friend;
            })
        });
    }
    return state;
}
