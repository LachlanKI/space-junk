const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const db = require('./utils/db.js');
const bcrypt = require('./utils/bcrypt.js');
const midWare = require('./utils/middleware.js');
const s3 = require('./utils/s3.js');
const amaz = require('./utils/config.json');
const csurf = require('csurf');

// middleware

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

app.use(cookieSession({
    secret: 'superdupersecret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('space-junkies', req.csrfToken());
    next();
});

app.use(express.static('./public'));

// socket.io

var onlineUsers = [];

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        let discId;
        onlineUsers = onlineUsers.filter(user => {
            if (user.socketId == socket.id) {
                discId = user.id;
            }
            return user.socketId != socket.id
        });
        let x = onlineUsers.some(user => user.id == discId)
        !x ? io.sockets.emit('userDisconnected', discId) : console.log('user still lingering');
    })

});

// get requests

app.get('/getLast10Messages', (req, res, next) => {
    db.getLast10Messages().then(result => {
        console.log('result from get 10 messages', result);
        res.json({messages:result});
    })
})

app.get('/connected/:socketId', (req, res, next) => {
    onlineUsers.push({id:req.session.user.id, socketId:req.params.socketId})
    console.log(onlineUsers);
    var onlineIds = [];
    onlineUsers.forEach(user => {
        if (!onlineIds.includes(user.id)) {
            onlineIds.push(user.id);
        }
    });
    db.getOnlineUsers(onlineIds).then(result => {
        io.sockets.sockets[req.params.socketId].emit('userJoined', {users:result, id:req.session.user.id});
        result = result.filter(user => user.id == req.session.user.id)[0];
        io.sockets.emit('newUserOnline', result);
        res.json({success:true});
    })

})

app.get('/getFriends', (req, res, next) => {
    db.getFriends(req.session.user.id).then((result) => {
        res.json({
            friends: result,
            id: req.session.user.id
        });
    })
});

app.get('/welcome', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/logout', (req, res, next) => {
    req.session = null;
    res.redirect('/');
});

app.get('/currentuser', (req, res, next) => {
    db.getUserInfo(req.session.user.id).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.json({'success':false})
    });
});

app.get('/otherUser', (req, res, next) => {
    let body = {};
    if (req.query.id == req.session.user.id) {
        res.json({gotoProfile:true});
    } else {
        db.getUserInfo(req.query.id).then((result) => {
            for (var prop in result) {
                body[prop] = result[prop]
            }
            db.checkFriendStatus(req.session.user.id, req.query.id).then((statusResult) => {
                console.log('statusResult', statusResult);
                for (prop in statusResult) {
                    body[prop] = statusResult[prop]
                }
                console.log('body with status ====> ', body);
                res.json(body);
            })
        }).catch((err) => {
            console.log('this is the error', err);
            res.json({'nouser':true});
        });
    }
});

app.get('*', (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

// post requests

app.post('/logMessage', (req, res, next) => {
    db.logMessage(req.body.id, req.body.message).then(result => {
        return result
    }).then(data => {
            io.sockets.emit('newMessage', data)
            res.json({success:true})
    })
})

app.post('/sendFriendRequest', (req, res, next) => {
    db.sendFriendRequest(req.session.user.id, req.body.otherId, req.body.status).then((result) => {
        console.log(result);
        db.getName(req.session.user.id).then(results => {
            let recipientSockets = onlineUsers.filter(user => user.id == req.body.otherId);
            if (recipientSockets.length > 0) {
                let sender = {
                    firstname: results.firstname,
                    lastname: results.lastname
                };
                recipientSockets.forEach(user => {
                    io.sockets.sockets[user.socketId].emit('yourNotAlone', {sender, type:'send'});
                })
            } else {
                console.log('they are not online');
            }
        })
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/cancelFriendRequest', (req, res, next) => {
    db.cancelFriendRequest(req.session.user.id, req.body.otherId).then((result) => {
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/acceptFriendRequest', (req, res, next) => {
    db.acceptFriendRequest(req.session.user.id, req.body.otherId).then((result) => {
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/terminateFriendRequest', (req, res, next) => {
    db.terminateFriendRequest(req.session.user.id, req.body.otherId).then((result) => {
        db.getName(req.session.user.id).then(results => {
            let recipientSockets = onlineUsers.filter(user => user.id == req.body.otherId);
            console.log(recipientSockets);
            if (recipientSockets.length > 0) {
                let sender = {
                    firstname: results.firstname,
                    lastname: results.lastname
                };
                recipientSockets.forEach(user => {
                    io.sockets.sockets[user.socketId].emit('yourGotTerminated', {sender, type:'terminated'});
                })
            } else {
                console.log('they are not online');
            }
        })
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/rejectFriendRequest', (req, res, next) => {
    db.rejectFriendRequest(req.session.user.id, req.body.otherId).then((result) => {
        db.getName(req.session.user.id).then(results => {
            let recipientSockets = onlineUsers.filter(user => user.id == req.body.otherId);
            console.log(recipientSockets);
            if (recipientSockets.length > 0) {
                let sender = {
                    firstname: results.firstname,
                    lastname: results.lastname
                };
                recipientSockets.forEach(user => {
                    io.sockets.sockets[user.socketId].emit('yourGotRejected', {sender, type:'rejected'});
                })
            } else {
                console.log('they are not online');
            }
        })
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/editBio', (req, res, next) => {
    db.updateBio(req.session.user.id, req.body.newBio).then((result) => {
        res.json(result);
    }).catch((err) => console.log(err));
});

app.post('/updateProfPic', uploader.single('image'), (req, res, next) => {
    s3.uploadS3(req.file).then(() => {
        return db.insertProfPic(req.session.user.id, req.file.filename).then((result) => {
            result.image = amaz.s3Url + result.image;
            res.json(result);
        })
    }).catch((err) => {
        console.log(err);
        res.json({'success':false});
    })
});

app.post('/register', (req, res, next) => {
    bcrypt.hashPassword(req.body.password).then((hash) => {
        return db.insertUser(req.body.firstname, req.body.lastname, req.body.email, hash).then((id) => {
            req.session.user = {
                id: id
            }
            res.json({'success': true});
        });
    }).catch((err) => {
        console.log(err);
        res.json({'success': false});
    });
});

app.post('/login', (req, res, next) => {
    db.checkLogin(req.body.email).then((result) => {
        bcrypt.checkPassword(req.body.password, result.hashedpass).then((doesMatch) => {
            if (doesMatch) {
                req.session.user = {
                    id: result.id
                }
                res.json({'success': true});
            } else {
                console.log('it didnt match');
                res.json({'success': false})
            }
        }).catch((err) => {
            console.log('this is the hashing error', err);
            res.json({'success': false});
        });
    }).catch((err) => {
        res.json({'success': false});
    });
});

server.listen(8080, function() {
    console.log("Listening on 8080...")
});
