import React from 'react';
import axios from './axios.js';
import Logo from './logo.js';
import Logout from './logout.js';
import ProfilePic from './profpic.js';
import UpdateProfPic from './updateProfPic.js';
import EditBio from './editbio.js';
import Updates from './updates.js';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false,
            showBioEdit: false
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.handleBio = this.handleBio.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.otherUserReq = this.otherUserReq.bind(this);
        this.toggleBioEdit = this.toggleBioEdit.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.cancelFriendRequest = this.cancelFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
        this.terminateFriendRequest = this.terminateFriendRequest.bind(this);
    }
    ////////////////// USERS OWN PROFILE PAGE ////////////////////
    componentDidMount() {
        axios.get('/currentuser').then((resp) => {
            (resp.data.success = false) ? this.setState({'error': true})
            : this.setState({
                 error: false,
                 firstname: resp.data.firstname,
                 lastname: resp.data.lastname,
                 bio: resp.data.bio,
                 id: resp.data.id,
                 profilePic: resp.data.image || '/imgs/userProf.png'
             })
        }).catch((err) => console.log('error in get /user', err));
    }
    handleBio(e) {
        this.setState({
            newBio: e.target.value
        });
    }
    submitBio(e) {
        e.preventDefault();
        if (!this.state.newBio) {
            this.setState({'error': true});
        } else {
            this.setState({'error': false});
            const {newBio} = this.state;
            const data = {newBio};
            axios.post('/editBio', data).then((resp) => {
                this.setState({
                    bio: resp.data.bio,
                    showBioEdit: false
                });
            });
        }
    }
    toggleBioEdit(e) {
        this.setState({
            showBioEdit: !this.state.showBioEdit
        });
    }
    ///////////////////// OTHER USER PROFILES ////////////////
    sendFriendRequest(e) {
        axios.post('/sendFriendRequest', {
            otherId: this.state.ouid,
            status: this.state.friendStatus
        }).then((resp) => {
            this.setState({
                friendStatus: resp.data.status,
                sender_id: resp.data.sender_id,
                recipient_id: resp.data.recipient_id
            });
        });
    }
    cancelFriendRequest(e) {
        axios.post('/cancelFriendRequest', {
            otherId: this.state.ouid
        }).then((resp) => {
            this.setState({
                friendStatus: resp.data.status,
                sender_id: resp.data.sender_id,
                recipient_id: resp.data.recipient_id
            });
        });
    }
    acceptFriendRequest(e) {
        axios.post('/acceptFriendRequest', {
            otherId: this.state.ouid
        }).then((resp) => {
            this.setState({
                friendStatus: resp.data.status,
                sender_id: resp.data.sender_id,
                recipient_id: resp.data.recipient_id
            });
        });
    }
    rejectFriendRequest(e) {
        axios.post('/rejectFriendRequest', {
            otherId: this.state.ouid
        }).then((resp) => {
            this.setState({
                friendStatus: resp.data.status,
                sender_id: resp.data.sender_id,
                recipient_id: resp.data.recipient_id
            });
        });
    }
    terminateFriendRequest(e) {
        axios.post('/terminateFriendRequest', {
            otherId: this.state.ouid
        }).then((resp) => {
            this.setState({
                friendStatus: resp.data.status,
                sender_id: resp.data.sender_id,
                recipient_id: resp.data.recipient_id
            });
        });
    }
    otherUserReq(param) {
        axios.get('/otherUser?id=' + param).then((resp) => {
            resp.data.nouser ? this.setState({'ouerror': true})
            : resp.data.gotoProfile ? browserHistory.push('/')
            : this.setState({
                 error: false,
                 oufirstname: resp.data.firstname,
                 ouid: resp.data.id,
                 oulastname: resp.data.lastname,
                 friendStatus: resp.data.status,
                 sender_id: resp.data.sender_id,
                 recipient_id: resp.data.recipient_id,
                 oubio: resp.data.bio || 'this user has no bio',
                 ouprofilePic: resp.data.image || '/imgs/userProf.png',
             });
        });
    }
    ///////////////////// PROFILE PIC //////////////////////
    toggleUploader(e) {
        this.setState({
            showUploader: !this.state.showUploader
        })
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.image) {
            this.setState({'error': true});
        } else {
            let formData = new FormData();
            formData.append('image', this.state.image);
            axios.post('/updateProfPic', formData).then((resp) => {
                resp.data.image ? this.setState({profilePic: resp.data.image}) : this.setState({'error': true});
            });
        }
    }
    render() {
        const {id, firstname, lastname, profilePic, bio, oufirstname, oulastname, ouprofilePic, oubio, error, ouerror, ouid, showBioEdit, friendStatus, sender_id, recipient_id} = this.state;
        const children = React.cloneElement(this.props.children, {
            id,
            firstname,
            lastname,
            profilePic,
            bio,
            oufirstname,
            oulastname,
            ouprofilePic,
            oubio,
            error,
            ouerror,
            ouid,
            showBioEdit,
            friendStatus,
            sender_id,
            recipient_id,
            toggleUploader: this.toggleUploader,
            handleBio: this.handleBio,
            submitBio: this.submitBio,
            otherUserReq: this.otherUserReq,
            toggleBioEdit: this.toggleBioEdit,
            sendFriendRequest: this.sendFriendRequest,
            cancelFriendRequest: this.cancelFriendRequest,
            acceptFriendRequest: this.acceptFriendRequest,
            terminateFriendRequest: this.terminateFriendRequest,
            rejectFriendRequest: this.rejectFriendRequest
        });
        return (
            <div>
                <Logo />
                <div id='log-and-pic'>
                <Logout />
                <Link id='friends-link' to='/friends'></Link>
                <Link id='whosonline-link' to='/whosonline'></Link>
                <Link id='chatroom-link' to='/chatroom'></Link>
                <ProfilePic
                toggleUploader={this.toggleUploader} profilePic={profilePic} firstname={firstname}
                />
                </div>
                <div id='app'>
                    {this.state.showUploader && <UpdateProfPic
                        handleChange={this.handleChange} handleSubmit={this.handleSubmit}
                    />}
                    {this.state.showBioEdit && <EditBio
                        submitBio={this.submitBio} handleBio={this.handleBio} bio={this.state.bio} error={this.state.error}
                    />}
                    {children}
                </div>
                <Updates />
            </div>
        )
    }
}
