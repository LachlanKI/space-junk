import React from 'react';
import FriendButton from './friendButton.js';

export default class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.otherUserReq(this.props.params.id);
    }
    render() {
        if (this.props.ouerror) {
            return (
                <h1>NO USER EXISTS WITH THIS ID</h1>
            )
        } else {
            return (
                    <div id='your-profile'>
                        <div className='prof-name-wrap'>
                            <h1 className='prof-name'>{this.props.oufirstname} {this.props.oulastname}</h1>
                        </div>
                        <div className='prof-pic-wrap'>
                            <img className="prof-pic" src={this.props.ouprofilePic} alt={this.props.oufirstname}></img>
                        </div>
                        <div className='edit-bio-q-wrap'>
                            <p className='edit-bio-q'>{this.props.oubio}</p>
                        </div>
                        <div className='friend-button-wrap'>
                        <FriendButton className='friend-button'
                        rejectFriendRequest={this.props.rejectFriendRequest}
                        terminateFriendRequest={this.props.terminateFriendRequest}
                        acceptFriendRequest={this.props.acceptFriendRequest}
                        cancelFriendRequest={this.props.cancelFriendRequest}
                        sendFriendRequest={this.props.sendFriendRequest}
                        id={this.props.id} ouid={this.props.ouid}
                        friendStatus={this.props.friendStatus}
                        sender_id={this.props.sender_id}
                        recipient_id={this.props.recipient_id}
                        />
                        </div>
                    </div>
            )
        }
    }
}
