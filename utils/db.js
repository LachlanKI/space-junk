const amaz = require('./config.json');
const spicedPg = require('spiced-pg');
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const secrets = require('./secrets.json');
    db = spicedPg(`postgres:${secrets.user}:${secrets.pass}@localhost:5432/network`);
}

function insertUser(first, last, email, hashedpass) {
    return db.query(`INSERT INTO users (firstname, lastname, email, hashedpass) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [first, last, email, hashedpass]).then((result) => {
                        return result.rows[0].id;
                    });
}

module.exports.insertUser = insertUser;

function checkLogin(email) {
    return db.query(`SELECT hashedpass, firstname, lastname, id FROM users WHERE email = $1`,
                    [email]).then((result) => {
                        return result.rows[0]
                    });
}

module.exports.checkLogin = checkLogin;

function insertProfPic(userId, image) {
    return db.query(`INSERT INTO profilepics (userId, image) VALUES ($1, $2) RETURNING image`,
                    [userId, image]).then((result) => {
                        return result.rows[0];
                    })
}

module.exports.insertProfPic = insertProfPic;

function getUserInfo(id) {
    let userArr = [];
    return db.query(`SELECT firstname, lastname, id, bio FROM users WHERE id = $1`,
                     [id]).then((result) => {
                         return result.rows[0];
                     }).then((result) => {
                         userArr.push(result);
                         return db.query(`SELECT image, created_at FROM profilepics WHERE userId = $1`,
                                         [result.id]).then((imgResult) => {
                                             imgResult.rows.sort((a, b) => {
                                                 return b.created_at - a.created_at;
                                             })
                                             return imgResult.rows[0]
                                         })
                     }).then((img) => {
                         if (!img) {
                             return userArr[0];
                         } else {
                             img.image = amaz.s3Url + img.image;
                             userArr[0].image = img.image;
                             return userArr[0];
                         }
                     })
}

module.exports.getUserInfo = getUserInfo;

function updateBio(id, bio) {
    return db.query(`UPDATE users SET bio = $2 WHERE id = $1 RETURNING bio`,
                    [id, bio]).then((result) => {
                        return result.rows[0];
                    });
}

module.exports.updateBio = updateBio;

function checkFriendStatus(id, otherId) {
    return db.query(`SELECT status, sender_id, recipient_id FROM friend_statuses
                     WHERE (sender_id = $1 AND recipient_id = $2)
                     OR (sender_id = $2 AND recipient_id = $1)`,
                    [id, otherId]).then((result) => {
                        return result.rows[0];
                    });
}

module.exports.checkFriendStatus = checkFriendStatus;

function sendFriendRequest(id, otherId, status) {
    if (!status) {
        return db.query(`INSERT INTO friend_statuses (sender_id, recipient_id, status) VALUES ($1, $2, 1) RETURNING status, sender_id, recipient_id`,
            [id, otherId]).then((result) => {
                return result.rows[0];
            });
    } else {
        return checkFriendStatus(id, otherId).then((val) => {
            if (id == val.sender_id) {
                return db.query(`UPDATE friend_statuses
                    SET status = 1
                    WHERE sender_id = $1
                    AND recipient_id = $2
                    RETURNING status, sender_id, recipient_id`,
                    [id, otherId]).then((result) => {
                        return result.rows[0];
                    });
            } else {
                return db.query(`UPDATE friend_statuses
                    SET (status, sender_id, recipient_id) = (1, $1, $2)
                    WHERE sender_id = $2
                    AND recipient_id = $1
                    RETURNING status, sender_id, recipient_id`,
                    [id, otherId]).then((result) => {
                        return result.rows[0];
                    });
            }
        });
    }
}

module.exports.sendFriendRequest = sendFriendRequest;

function cancelFriendRequest(id, otherId) {
    return db.query(`UPDATE friend_statuses
                     SET status = 3
                     WHERE sender_id = $1
                     AND recipient_id = $2
                     RETURNING status, sender_id, recipient_id`,
                     [id, otherId]).then((result) => {
                         return result.rows[0];
                     });
}

module.exports.cancelFriendRequest = cancelFriendRequest;

function acceptFriendRequest(id, otherId) {
    return db.query(`UPDATE friend_statuses
                     SET status = 2
                     WHERE sender_id = $2
                     AND recipient_id = $1
                     RETURNING status, sender_id, recipient_id`,
                     [id, otherId]).then((result) => {
                         return result.rows[0];
                     });
}

module.exports.acceptFriendRequest = acceptFriendRequest;

function rejectFriendRequest(id, otherId) {
    return db.query(`UPDATE friend_statuses
                     SET status = 5
                     WHERE sender_id = $2
                     AND recipient_id = $1
                     RETURNING status, sender_id, recipient_id`,
                     [id, otherId]).then((result) => {
                         return result.rows[0];
                     });
}

module.exports.rejectFriendRequest = rejectFriendRequest;

function terminateFriendRequest(id, otherId) {
    return db.query(`UPDATE friend_statuses
                     SET status = 4
                     WHERE (sender_id = $1 AND recipient_id = $2)
                     OR (sender_id = $2 AND recipient_id = $1)
                     RETURNING status, sender_id, recipient_id`,
                     [id, otherId]).then((result) => {
                         return result.rows[0];
                     });
}

module.exports.terminateFriendRequest = terminateFriendRequest;
//
function getFriends(id) {
    let userArr = [];
    return db.query(`SELECT sender_id, recipient_id, status FROM friend_statuses
                      WHERE sender_id = $1
                      OR recipient_id = $1`,
                      [id]).then((result) => {
                          let otherUsers = result.rows.map((user) => {
                              if (user.sender_id != id) {
                                  return user.sender_id;
                              } else if (user.recipient_id != id) {
                                  return user.recipient_id;
                              }
                          });
                          userArr.push(result.rows);
                          return otherUsers;
                      }).then((otherUsers) => {
                          return db.query(`SELECT id, firstname, lastname
                              FROM users
                              WHERE id = ANY($1)`,
                              [otherUsers]).then((info) => {
                                  info.rows.forEach((elem) => {
                                      let id2 = elem.id
                                      let usr = elem
                                      userArr[0].forEach((elem2) => {
                                          if (elem2.sender_id == id2 || elem2.recipient_id == id2) {
                                              elem2.oufirstname = usr.firstname;
                                              elem2.oulastname = usr.lastname;
                                              elem2.ouId = usr.id;
                                          }
                                      })
                                  })
                                  return otherUsers;
                              }).then((ret) => {
                                  return ret;
                              })
                      }).then((users) => {
                          promiseArr = [];
                          users.forEach((id) => {
                              promiseArr.push(db.query(`SELECT image, created_at FROM profilepics WHERE userId = $1`,
                                                       [id]).then((res) => {
                                                           if (res.rows[0]) {
                                                               res.rows.sort((a, b) => {
                                                                   return b.created_at - a.created_at;
                                                               })
                                                               res.rows[0].userImgId = id
                                                               userArr[0].forEach((elem) => {
                                                                   if (elem.ouId == res.rows[0].userImgId) {
                                                                       elem.image = amaz.s3Url + res.rows[0].image;
                                                                   }
                                                               })
                                                               return res.rows[0]
                                                           }
                                                       }))
                          })
                          return promiseArr;
                      }).then((arr) => {
                          return Promise.all(arr).then(() => {
                              return userArr[0]
                          })
                      }).then((jeez) => {
                          return jeez;
                      });
}

module.exports.getFriends = getFriends;

function getOnlineUsers(ids) {
    let userArr = [];
    return db.query(`SELECT id, firstname, lastname FROM users WHERE id = ANY($1)`,
                    [ids]).then(result => result.rows).then(res => {
                        userArr.push(res);
                        promiseArr = [];
                        ids.forEach((id) => {
                            promiseArr.push(db.query(`SELECT image, created_at FROM profilepics WHERE userId = $1`,
                                                     [id]).then((res) => {
                                                         if (res.rows[0]) {
                                                             res.rows.sort((a, b) => {
                                                                 return b.created_at - a.created_at;
                                                             })
                                                             res.rows[0].userImgId = id;
                                                             userArr[0].forEach((elem) => {
                                                                 if (elem.id == res.rows[0].userImgId) {
                                                                     elem.image = amaz.s3Url + res.rows[0].image;
                                                                 }
                                                             })
                                                             return res.rows[0]
                                                         }
                                                     }))
                        })
                        return promiseArr;
                    }).then((arr) => {
                        return Promise.all(arr).then(() => {
                            return userArr[0]
                        })
                    }).then((jeez) => {
                        return jeez;
                    });
}

module.exports.getOnlineUsers = getOnlineUsers;

function logMessage(id, message) {
    let user;
    return db.query(`INSERT INTO chat (userId, message) VALUES ($1, $2) RETURNING userId, message, created_at`,
                    [id, message]).then(res => {
                        user = res.rows[0];
                        console.log('user!!!!!!!', user);
                        return getName(user.userid).then(result => {
                            console.log('second result!!!!@!£!@!', result);
                            user.firstname = result.firstname
                        }).then(() => {
                            console.log('plsplsplsplsplsplsplsplspls', user);
                            return user;
                        })
                    })
}

module.exports.logMessage = logMessage;

function getLast10Messages() {
    let messages;
    let ids = [];
    return db.query(`SELECT userId, message, created_at
                     FROM chat
                     ORDER BY id DESC
                     LIMIT 10`).then(res => {
                         res.rows.sort((a, b) => {
                             return a.created_at - b.created_at;
                         })
                         messages = res.rows;
                         messages.forEach(user => {
                             console.log('user!!!!!!', user);
                             ids.push(user.userid)
                         })
                         console.log('ids?', ids);
                         return getNames(ids).then(result => {
                             console.log('result from get names', result);
                             console.log('messages 1111111', messages);
                                 messages.forEach(message => {
                                     result.forEach(row => {
                                     if (row.id == message.userid) {
                                        message.firstname = row.firstname
                                     }
                                 })
                             })
                             console.log('messages?', messages);
                             return messages;
                         })
                     })
}

module.exports.getLast10Messages = getLast10Messages;

function getName(id) {
    return db.query(`SELECT firstname, lastname FROM users WHERE id = $1`,
                     [id]).then(result => {
                         console.log('in db', result.rows);
                         return result.rows[0];
                     });
}

module.exports.getName = getName;

function getNames(ids) {
    return db.query(`SELECT id, firstname FROM users WHERE id = ANY($1)`,
                    [ids]).then(res => res.rows)
}
