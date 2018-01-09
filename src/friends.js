import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {getFriends, getUserId, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest, terminateFriendRequest} from './actions.js';

class Friends extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.props.getFriends();
    }
    render() {
        const {id, status_accepted, status_pending, status_rejected, status_terminated, status_cancelled, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest, terminateFriendRequest} = this.props;
        const defImg = '/imgs/userProf.png';
        console.log(this.props);
        return (
            <div className='friend-page-wrap'>
            {status_pending && status_pending.length > 0 &&
                <div className='pending-wrap'>
                    <div className='pending'>
                    {status_pending && <p>hello</p> && status_pending.map(elem => {
                        let url = `/user/${elem.ouId}`
                        return (
                            <div className='friend'>
                            <Link to={url}><img className='friend-img' src={elem.image || defImg} alt={elem.oufirstname}/></Link>
                            <h3>{elem.oufirstname + ' ' + elem.oulastname}</h3>
                            {id == elem.sender_id && <button onClick={() => cancelFriendRequest(elem.ouId)}>cancel</button>}
                            {id == elem.recipient_id && <div><button onClick={() => acceptFriendRequest(elem.ouId)}>accept</button><button onClick={() => rejectFriendRequest(elem.ouId)}>reject</button></div>}
                            </div>
                        )
                    }
                )}
                </div>
                </div>
            }
                {status_accepted && status_accepted.length > 0 &&
                    <div className='accepted-wrap'>
                        <div className='accepted'>
                        {status_accepted && status_accepted.map(elem => {
                            let url = `/user/${elem.ouId}`
                            return (
                                <div className='friend'>
                                <Link to={url}><img className='friend-img' src={elem.image || defImg} alt={elem.oufirstname}/></Link>
                                <h3>{elem.oufirstname + ' ' + elem.oulastname}</h3>
                                <button onClick={() => terminateFriendRequest(elem.ouId)}>terminate friendship</button>
                                </div>
                            )
                        }
                    )}
                    </div>
                    </div>
                }
                {status_rejected && status_rejected.length > 0 &&
                    <div className='rejected-wrap'>
                        <div className='rejected'>
                        {status_rejected && status_rejected.map(elem => {
                            let url = `/user/${elem.ouId}`
                            return (
                                <div className='friend'>
                                <Link to={url}><img className='friend-img' src={elem.image || defImg} alt={elem.oufirstname}/></Link>
                                <h3>{elem.oufirstname + ' ' + elem.oulastname}</h3>
                                <button onClick={() => sendFriendRequest(elem.ouId, elem.status)}>add "friend"</button>
                                </div>
                            )
                        }
                    )}
                    </div>
                    </div>
                }
                {status_cancelled && status_cancelled.length > 0 &&
                    <div className='cancelled-wrap'>
                        <div className='cancelled'>
                        {status_cancelled && status_cancelled.map(elem => {
                            let url = `/user/${elem.ouId}`
                            return (
                                <div className='friend'>
                                <Link to={url}><img className='friend-img' src={elem.image || defImg} alt={elem.oufirstname}/></Link>
                                <h3>{elem.oufirstname + ' ' + elem.oulastname}</h3>
                                <button onClick={() => sendFriendRequest(elem.ouId, elem.status)}>add friend</button>
                                </div>
                            )
                        }
                    )}
                    </div>
                    </div>
                }
                {status_terminated && status_terminated.length > 0 &&
                            <div className='terminated-wrap'>
                        <div className='terminated'>
                        {status_terminated && status_terminated.map(elem => {
                            let url = `/user/${elem.ouId}`
                            return (
                                <div className='friend'>
                                <Link to={url}><img className='friend-img' src={elem.image || defImg} alt={elem.oufirstname}/></Link>
                                <h3>{elem.oufirstname + ' ' + elem.oulastname}</h3>
                                <button onClick={() => sendFriendRequest(elem.ouId, elem.status)}>add friend</button>
                                </div>
                            )
                        }
                    )}
                    </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.id && state.id,
        status_accepted: state.friends && state.friends.filter(friend => friend.status == 2),
        status_pending: state.friends && state.friends.filter(friend => friend.status == 1),
        status_rejected: state.friends && state.friends.filter(friend => friend.status == 5),
        status_terminated: state.friends && state.friends.filter(friend => friend.status == 4),
        status_cancelled: state.friends && state.friends.filter(friend => friend.status == 3)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriends() {
            dispatch(getFriends());
        },
        getUserId() {
            dispatch(getUserId());
        },
        sendFriendRequest(ouId, status) {
            dispatch(sendFriendRequest(ouId, status));
        },
        cancelFriendRequest(ouId) {
            dispatch(cancelFriendRequest(ouId));
        },
        acceptFriendRequest(ouId) {
            dispatch(acceptFriendRequest(ouId));
        },
        rejectFriendRequest(ouId) {
            dispatch(rejectFriendRequest(ouId));
        },
        terminateFriendRequest(ouId) {
            dispatch(terminateFriendRequest(ouId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
