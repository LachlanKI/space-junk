import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class WhosOnline extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log('got me some props ==> ', this.props);
        const {onlineUsers, id} = this.props;
        const defImg = '/imgs/userProf.png';
        return (
            <div className='whosonline-component'>
                <div className='the-wrap-to-wrap'>
                    {onlineUsers && onlineUsers.map(user => {
                        let url = `/user/${user.id}`
                        return (
                            <div className='friend-online-wrap'>
                            <div className='friend-online'>
                            <Link to={url}><img className='online-prof' src={user.image || defImg} alt={user.oufirstname}/></Link>
                            </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.id && state.id,
        onlineUsers: state.onlineUsers && state.onlineUsers
    }
}

export default connect(mapStateToProps, null)(WhosOnline);
