import axios from './axios.js';
import React from 'react';
import {connect} from 'react-redux';

class Updates extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.update !== this.props.update) {
            console.log('refs was update');
            this.refs.update.className = 'updateAni';
                setTimeout(() => {
                    return this.refs.update.className = 'update'
                }, 3000)
        }
        if (prevProps.notification !== this.props.notification) {
            console.log('refs was notif');
               this.refs.notif.className = 'notifAni';
               setTimeout(() => {
                   return this.refs.notif.className = 'notif'
               }, 3000)
        }
    }
    render() {
        const {update, notification} = this.props
        return (
            <div className='updates'>
                <div className='activity-wrap'>
                    <div className='onlineActivity'>
                        {update && update.type == 'left' && <h3 ref='update' className='update'>{update.user.firstname} {update.user.lastname} left</h3>}
                        {update && update.type == 'join' && <h3 ref='update' className='update'>{update.user.firstname} {update.user.lastname} joined</h3>}
                    </div>
                </div>
                <div className='notifications-wrap'>
                    <div className='notifications'>
                        {notification && notification.type == 'send' && <h3 ref='notif' className='notif'>{notification.sender.firstname} {notification.sender.lastname} wants you</h3>}
                        {notification && notification.type == 'rejected' && <h3 ref='notif' className='notif'>{notification.sender.firstname} {notification.sender.lastname} just rejected your approach</h3>}
                        {notification && notification.type == 'terminated' && <h3 ref='notif' className='notif'>{notification.sender.firstname} {notification.sender.lastname} just relinquished your friendship</h3>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        update: state.update && state.update,
        notification: state.notification && state.notification
    }
}

export default connect(mapStateToProps, null)(Updates);
