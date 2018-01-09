import React from 'react';
import {connect} from 'react-redux';
import {logMessage, logText, getLast10Messages} from './actions.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getLast10Messages();
    }
    componentDidUpdate() {
        this.refs.x.scrollTop = this.refs.x.scrollHeight - this.refs.x.clientHeight
    }
    render() {
        const {onlineUsers, messages, id, logText, logMessage, message} = this.props;
        const defImg = '/imgs/userProf.png';
        return (
            <div className='chatbox-wrap'>
                <div className='chatbox'>
                    <div ref='x' className='messages'>
                        {messages && messages.map(message => <span className='message-wrap'><p>{message.firstname} >> {message.message}</p></span>)}
                    </div>
                    <div className='typeToChat'>
                        <div className='move-textarea'>
                            <div className='textarea-wrap-cht'>
                                <textarea ref='textarea' onChange={(e) => this.text = (e.target.value)} name="typeToChat"></textarea>
                            </div>
                        </div>
                        <div className='eject-wrap'>
                            <button onClick={() => {
                                logMessage(id, this.text);
                                this.refs.textarea.value = '';
                            }}></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.id && state.id,
        onlineUsers: state.onlineUsers && state.onlineUsers,
        messages: state.messages && state.messages,
        message: state.message && state.message
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logMessage(id, message) {
            dispatch(logMessage(id, message));
        },
        // logText(e) {
        //     dispatch(logText(e));
        // },
        getLast10Messages() {
            dispatch(getLast10Messages());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);
