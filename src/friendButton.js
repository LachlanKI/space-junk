import React from 'react';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props),
        this.state = {};
    }
    render() {
        return (
            <div id='the-button-component'>
                {(!this.props.friendStatus || this.props.friendStatus > 2) && <button className='cus-friend-but' onClick={this.props.sendFriendRequest}>add friend</button>}
                {this.props.friendStatus == 1 && this.props.id == this.props.sender_id && <button className='cus-friend-but' onClick={this.props.cancelFriendRequest}>cancel request</button>}
                {this.props.friendStatus == 1 && this.props.id == this.props.recipient_id && <div><button className='cus-friend-but' onClick={this.props.acceptFriendRequest}>accept request</button><button className='cus-friend-but' onClick={this.props.rejectFriendRequest}>reject request</button></div>}
                {this.props.friendStatus == 2 && <button className='cus-friend-but' onClick={this.props.terminateFriendRequest}>end friendship</button>}
            </div>
        )
    }
}
