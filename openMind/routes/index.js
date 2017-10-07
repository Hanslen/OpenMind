var express = require('express');

var mysql = require('../service/database');
var config = require('../config');

var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var router = express.Router();

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Please make sure your request has an Authorization header'
    });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({
      message: err.message
    });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({
      message: 'Token has expired'
    });
  }
  req.userId = payload.sub;
  next();
}

router.param('id', function(req, res, next, id) {
  req.id = id;
  next();
});

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user.userId,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.get('/api/me', ensureAuthenticated, function(req, res) {
  mysql.query("SELECT * FROM openmind.users WHERE userId = ?", [req.userId], function(err, result) {
    // console.log(result);
    var user = result[0];
    // console.log(user);
    res.send(user);
  })
});

router.get('/api/getAllUser', ensureAuthenticated, function(req, res){
  mysql.query("SELECT * FROM openmind.users", function(err,result){
      console.log(result);
      res.send(result);
  })
});


router.get('/api/getPeerApplying', ensureAuthenticated, function(req, res){
  mysql.query("SELECT * FROM openmind.applicationToBePeer WHERE userID = ?", [req.userId], function(err, result){
    var user = result[0];
    res.send(user);
  })
});

router.post('/api/jinyan', ensureAuthenticated, function(req, res){
  mysql.query("UPDATE openmind.users set time = ? where userId = ?", [req.body.jinyantime, req.body.userId], function(err, result){
    console.log("jinyan:"+req.timjinyantimee);
    console.log("userId:"+req.userId);
    res.send(result);
  })
});

/*
 |--------------------------------------------------------------------------
 | GET /api/message
 |--------------------------------------------------------------------------
 */
router.get('/api/unviewed_message', ensureAuthenticated, function(req, res) {
  mysql.query("SELECT * FROM openmind.messages WHERE userId = ? and viewed = 0", [req.userId], function(err, rows) {
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/message
 |--------------------------------------------------------------------------
 */
router.get('/api/message', ensureAuthenticated, function(req, res) {
  mysql.query("SELECT * FROM openmind.messages WHERE userId = ?", [req.userId], function(err, rows) {
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/forum
 |--------------------------------------------------------------------------
 */
router.get('/api/forums', function(req, res) {
  mysql.query("SELECT * FROM openmind.forum a, openmind.users b WHERE a.userId = b.userId", function(err, rows) {
    //console.log(rows);
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/forum/:id
 |--------------------------------------------------------------------------
 */

 router.get('/api/forum/:id', function(req, res) {
  //console.log(req.id);
  mysql.query("SELECT * FROM openmind.forum a, openmind.users b WHERE a.userId = b.userId AND forumId = ?",[req.id], function(err, rows) {
    res.send(rows);
  });
});

 /*
 |--------------------------------------------------------------------------
 | GET /api/forum_comments/:id
 |--------------------------------------------------------------------------
 */
 router.get('/api/forum_comments/:id', function(req, res) {
  //console.log(req.id);
  var sql = "SELECT a.forumCommentId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl FROM openmind.forumComments a, openmind.users b WHERE a.userId = b.userId and a.forumId = ?";
  mysql.query(sql,[req.id], function(err, rows) {
    // var sql2 = "SELECT a.forumCommentId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl FROM openmind.forumCommentInComment a, openmind.users b WHERE a.userId = b.userId and a.forumCommentId = ?";
    // for(var i = 0; i < rows.length; i++){
    //   mysql.query(sql2, [rows[i].forumCommentId], function(err, rows2){
    //     //rows[i].commentincomment = rows2;
    //     console.log("limiam");
    //   });
    // }
    // console.log("waimian");
    res.send(rows);
  });
});

router.get('/api/forum_allincomments',function(req, res){
  mysql.query("SELECT * FROM forumCommentInComment a, users b WHERE a.userId = b.userId", function(err,rows){
    res.send(rows);
  });
});



 /*
 |--------------------------------------------------------------------------
 | GET /api/forum_incomments/:id
 |--------------------------------------------------------------------------
 */
 router.get('/api/forum_incomments/:id', function(req, res) {
  //console.log(req.id);
  var sql = "SELECT a.forumCommentId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl FROM openmind.forumCommentInComment a, openmind.users b WHERE a.userId = b.userId and a.forumCommentId = ?";
  mysql.query(sql,[req.id], function(err, rows) {
    //console.log(req.id);
    //console.log(rows);
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | post /api/message/:id
 |--------------------------------------------------------------------------
 */
router.post('/api/view_message/:id', ensureAuthenticated, function(req, res) {
  // UPDATE `openmind`.`messages` SET `viewed`=1 WHERE `messageId`='1';
  mysql.query("UPDATE openmind.messages SET viewed=1 WHERE messageId = ?", [req.id], function(err, rows) {
    if (err) throw err;
    res.send();
  });
});


/*
 |--------------------------------------------------------------------------
 | GET /api/broadcast_collections
 |--------------------------------------------------------------------------
 */
router.get('/api/broadcast_collections', ensureAuthenticated, function(req, res) {
  //  SELECT b.broadcastId, b.title, b.startTime, b.imageUrl
  // FROM openmind.broadcastCollections a, openmind.broadcasts b
  // WHERE a.broadcastId = b.broadcastId AND a.userId = 29;
  var sql = 'SELECT b.broadcastId, b.title, b.startTime, b.imageUrl ' +
    'FROM openmind.broadcastCollections a, openmind.broadcasts b ' +
    'WHERE a.broadcastId = b.broadcastId AND a.userId = ?';
  mysql.query(sql, [req.userId], function(err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/topic_collections pai
 |--------------------------------------------------------------------------
 */
router.get('/api/topic_collections', ensureAuthenticated, function(req, res){
  var sql = 'SELECT b.topicId, b.title, b.time, b.imageUrl, b.peerId ' +
    'FROM openmind.topicCollections a, openmind.topics b ' +
    'WHERE a.topicId = b.topicId AND a.userId = ?';
  mysql.query(sql,[req.userId], function(err,rows){
    if (err) throw err;
    res.send(rows);
  });
});


/*
 |--------------------------------------------------------------------------
 | GET /api/discussion_collections
 |--------------------------------------------------------------------------
 */
router.get('/api/discussion_collections', ensureAuthenticated, function(req, res) {
  //  SELECT b.broadcastId, b.title, b.startTime, b.imageUrl
  // FROM openmind.broadcastCollections a, openmind.broadcasts b
  // WHERE a.broadcastId = b.broadcastId AND a.userId = 29;
  var sql = 'SELECT b.discussionId, b.title, b.startTime, b.imageUrl, b.price ' +
    'FROM openmind.discussionCollections a, openmind.discussions b ' +
    'WHERE a.discussionId = b.discussionId AND a.userId = ?';
  mysql.query(sql, [req.userId], function(err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/appointment_collections pai
 |--------------------------------------------------------------------------
 */
 router.get('/api/appointment_collections', ensureAuthenticated, function(req, res){
  var sql = 'SELECT * FROM openmind.appointments WHERE userId = ?';
  mysql.query(sql, [req.userId], function(err, rows){
    if(err) throw err;
    res.send(rows);
  })
 });

/*
 |--------------------------------------------------------------------------
 | GET /api/chekc_broadcast_collections/:id if there is a collection
 |--------------------------------------------------------------------------
 */
router.get('/api/check_broadcast_collections/:id', ensureAuthenticated, function(req, res) {
  mysql.query('SELECT * FROM openmind.broadcastCollections WHERE userId = ? and broadcastId = ?', [req.userId, req.id], function(err, rows) {
    if (err) throw err;
    return res.send({
      length: rows.length ? true : false
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | GET /api/check_topic_collections/:id if there is a collection pai
 |--------------------------------------------------------------------------
 */
router.get('/api/check_topic_collections/:id', ensureAuthenticated, function(req, res){
  mysql.query('SELECT topicId FROM openmind.topicCollections WHERE userId = ?', [req.userId], function(err, rows){
    if(err) throw err;
    return res.send({
      likeTopic: rows
    });
  })
});



/*
 |--------------------------------------------------------------------------
 | GET /api/chekc_discussion_collections/:id if there is a collection
 |--------------------------------------------------------------------------
 */
router.get('/api/check_discussion_collections/:id', ensureAuthenticated, function(req, res) {
  mysql.query('SELECT * FROM openmind.discussionCollections WHERE userId = ? and discussionId = ?', [req.userId, req.id], function(err, rows) {
    if (err) throw err;
    return res.send({
      length: rows.length ? true : false
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | INSERT /api/broadcast_collections/:id
 |--------------------------------------------------------------------------
 */
router.post('/api/broadcast_collections/:id', ensureAuthenticated, function(req, res) {
  // check if there already exists one
  mysql.query('SELECT * FROM openmind.broadcastCollections WHERE userId = ? and broadcastId = ?', [req.userId, req.id], function(err, rows) {
    if (err) throw err;
    if (!rows.length) {
      // INSERT INTO `openmind`.`broadcastCollections` (`userId`, `broadcastId`) VALUES ('29', '1');
      var sql = 'INSERT INTO openmind.broadcastCollections SET ?';
      var collection = {
        userId: req.userId,
        broadcastId: req.id
      }
      mysql.query(sql, collection, function(err, rows) {
        if (err) throw err;
        return res.send();
      });
    } else {
      return res.status(403).send({
        message: '您已经收藏过此电台'
      });
    }
  })
});

/*
 |--------------------------------------------------------------------------
 | INSERT /api/peer_collections/:id    pai
 |--------------------------------------------------------------------------
 */
 router.post('/api/peer_collections/:id', ensureAuthenticated, function(req,res){
  //console.log("into api/peer_collections");
  mysql.query('SELECT * FROM openmind.topicCollections WHERE userId = ? AND topicId = ?', [req.userId, req.id], function(err, rows){
    if(err) throw err;
    if(!rows.length){
      console.log("before sql");
      var sql = 'INSERT INTO openmind.topicCollections SET ?';
      var collection = {
        userId: req.userId,
        topicId: req.id
      };
      mysql.query(sql, collection, function(err, rows){
        console.log("err:"+err);
        console.log("rows:"+rows);
        if(err) throw err;
        return res.send();
      });
      console.log("after query");
    }else{
      return res.status(403).send({
        message: '您已经收藏过此话题'
      });
    }
  })
 });
/*
 |--------------------------------------------------------------------------
 | INSERT /api/discussion_collections/:id
 |--------------------------------------------------------------------------
 */
router.post('/api/discussion_collections/:id', ensureAuthenticated, function(req, res) {
  // check if there already exists one
  mysql.query('SELECT * FROM openmind.discussionCollections WHERE userId = ? and discussionId = ?', [req.userId, req.id], function(err, rows) {
    if (err) throw err;
    if (!rows.length) {
      var sql = 'INSERT INTO openmind.discussionCollections SET ?';
      var collection = {
        userId: req.userId,
        discussionId: req.id
      }
      mysql.query(sql, collection, function(err, rows) {
        if (err) throw err;
        return res.send();
      });
    } else {
      return res.status(403).send({
        message: '您已经收藏过此电台'
      });
    }
  })
});

/*
 |--------------------------------------------------------------------------
 | DELETE /api/broadcast_collections/:id
 |--------------------------------------------------------------------------
 */
router.delete('/api/broadcast_collections/:id', ensureAuthenticated, function(req, res) {
  var broadcastId = req.id;
  // DELETE FROM `openmind`.`broadcastCollections` WHERE `userId`='29' and`broadcastId`='3';
  var sql = 'DELETE FROM openmind.broadcastCollections WHERE userId = ? and broadcastId = ?';
  mysql.query(sql, [req.userId, broadcastId], function(err, rows) {
    if (err) throw err;
    res.send();
  });
});

router.delete('/api/deleteForumComment/:id', ensureAuthenticated, function(req, res){
  mysql.query("DELETE FROM openmind.forumComments WHERE forumCommentId = ?", [req.id], function(err, result){
    //console.log("CommentId: "+req.id);
    mysql.query("DELETE FROM openmind.forumCommentinComment WHERE forumCommentId = ?", [req.id], function(err, result){
      mysql.query("DELETE FROM openmind.forumCommentsLikes WHERE forumCommentId = ?", [req.id], function(err, result){
        if (err) throw err;
        res.send();
      });
    });
  });
});

router.delete('/api/deleteForumCommentinComment/:id', ensureAuthenticated, function(req, res){
    mysql.query("DELETE FROM openmind.forumCommentinComment WHERE incommentId = ?", [req.id], function(err, result){
      if (err) throw err;
      res.send();
    });
});

router.delete('/content/deleteDiscussionComment/:id', ensureAuthenticated, function(req,res){
  console.log("deleteDiscussionComment: "+[req.id]);
  mysql.query("DELETE FROM openmind.discussionComments WHERE discussionCommentId = ?", [req.id], function(err, result){
      mysql.query("DELETE FROM openmind.discussionCommentsLikes WHERE discussionCommentId = ?", [req.id], function(err,result){
          if(err) throw err;
          res.send();
      });
  });
});

router.delete('/content/broadcastCommentsId/:id', ensureAuthenticated, function(req,res){
    mysql.query("DELETE FROM openmind.broadcastComments WHERE broadcastCommentsId = ?", [req.id], function(err,result){
      mysql.query("DELETE FROM openmind.broadcastCommentsLikes WHERE broadcastCommentsId = ?", [req.id], function(err,result){
        if(err) throw err;
        res.send();
      });
    });
});

/*
 |--------------------------------------------------------------------------
 | DELETE /api/topic_collections/:id
 |--------------------------------------------------------------------------
 */
router.delete('/api/topic_collections/:id', ensureAuthenticated,function(req, res){
  var topicId = req.id;
  var sql = 'DELETE FROM openmind.topicCollections WHERE userId = ? and topicId = ?';
  mysql.query(sql, [req.userId, topicId], function(err, rows){
    if(err) throw err;
    res.send();
  })
})

/*
 |--------------------------------------------------------------------------
 | DELETE /api/discussion_collections/:id
 |--------------------------------------------------------------------------
 */
router.delete('/api/discussion_collections/:id', ensureAuthenticated, function(req, res) {
  var discussionId = req.id;
  // DELETE FROM `openmind`.`broadcastCollections` WHERE `userId`='29' and`broadcastId`='3';
  var sql = 'DELETE FROM openmind.discussionCollections WHERE userId = ? and discussionId = ?';
  mysql.query(sql, [req.userId, discussionId], function(err, rows) {
    if (err) throw err;
    res.send();
  });
});

/*
 |--------------------------------------------------------------------------
 | Update username
 |--------------------------------------------------------------------------
 */
router.post('/api/username', ensureAuthenticated, function(req, res) {
  // UPDATE `openmind`.`users` SET `name`='admin@123.com' WHERE `userId`='21';
  mysql.query("UPDATE openmind.users SET name = ? WHERE userId = ?", [req.body.name, req.userId], function(err, result) {
    if (err) throw err;
    res.send();
  });
});

/*
 |--------------------------------------------------------------------------
 | Update password
 |--------------------------------------------------------------------------
 */
router.post('/api/password', ensureAuthenticated, function(req, res) {
  mysql.query("SELECT * FROM openmind.users WHERE userId = ?", [req.userId], function(err, result) {
    if (err) throw err;
    if (!result.length) {
      return res.status(401).send({
        message: '错误'
      });
    }
    var user = result[0];
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          message: '旧密码错误'
        });
      }
      // hash password
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.new_password, salt, function(err, hash) {
          // user.password = hash;
          mysql.query("UPDATE openmind.users SET password = ? WHERE userId = ?", [hash, req.userId], function(err, result) {
            if (err) throw err;
            res.send();
          });
        });
      });
    });
  });
});
/*
 |--------------------------------------------------------------------------
 | Update userinfo(pai)
 |--------------------------------------------------------------------------
 */
router.post('/api/updateDetail', ensureAuthenticated, function(req, res) {
  // console.log("wow+QAQ");
  // UPDATE `openmind`.`users` SET `name`='admin@123.com' WHERE `userId`='21';
  console.log("gender: "+req.body.gender.selectedOption.id);
  mysql.query("UPDATE openmind.users SET briefInto = ?, school = ?, city = ?, age = ?, skype = ? WHERE userId = ?", [req.body.briefInto, req.body.school, req.body.city, req.body.age, req.body.skype,req.userId], function(err, result) {
    console.log("UPDATE openmind.users SET gender = "+req.body.gender.selectedOption.id);
    mysql.query("UPDATE openmind.users SET gender = !!? WHERE userId = ?", [req.body.gender.selectedOption.id,req.userId], function(err, result){
      if (err) throw err;
      res.send();
    });
  });
});

router.post('/api/applyPeer', ensureAuthenticated, function(req, res){
  mysql.query("select * from openmind.applicationToBePeer where userID = ?",[req.body.userid],function(err,result){
  if (!result.length){
	  mysql.query("INSERT INTO openmind.applicationToBePeer (userID, cv, education, tags, keyWords) VALUES (?,?,?,?,?)", [req.body.userid,req.body.cv, req.body.education, req.body.tags, req.body.keyWords], function(err, result){
		mysql.query("UPDATE openmind.users SET userType = 1 WHERE userId = ?",[req.body.userid], function(err, result){

		  if(err) throw err;
		  res.send();
		});
	  });
	}
	else{
		mysql.query("update openmind.applicationToBePeer set cv = ?,education = ?, tags = ? , keyWords = ?, applicationTime = Current_TimeStamp where userId = ?",[req.body.cv,req.body.education,req.body.tags,req.body.keyWords,req.body.userID],function(err,result){
		mysql.query("UPDATE openmind.users SET userType = 1 WHERE userId = ?",[req.body.userid], function(err, result){

		  if(err) throw err;
		  res.send();
		});

	});

	}
  });
});


/*
 |--------------------------------------------------------------------------
 | Apply a discussion
 |--------------------------------------------------------------------------
 */
router.post('/api/apply_discussion/:id', ensureAuthenticated, function(req, res) {

  mysql.query("SELECT * FROM openmind.discussionApplications WHERE discussionId = ? and userId = ?", [req.id, req.userId], function(err, rows) {
    if (err) throw err;
    if (rows.length) {
      res.status(403).send({
        message: '您已经申请过'
      });
    } else {
      mysql.query("SELECT * FROM openmind.discussions WHERE discussionId = ?", [req.id], function(err, rows) {
        var discussion = rows[0];
        if (discussion.currentNum >= discussion.maxNum) {
          res.status(403).send({
            message: '申请人数已满，请刷新页面'
          });
        } else {
          var sql = 'INSERT INTO openmind.discussionApplications SET ?';
          var json = {
            userId: req.userId,
            discussionId: req.id
          }
          mysql.query(sql, json, function(err, rows) {
            if (err) throw err;
            // UPDATE openmind.broadcastComments SET likeNum = likeNum+1 WHERE broadcastCommentsId = 2
            mysql.query('UPDATE openmind.discussions SET currentNum = currentNum+1 WHERE discussionId = ?', [req.id], function(err, rows) {
              if (err) throw err;
              return res.send();
            });

          });
        }
      });
    }
  })
});

/*
 |--------------------------------------------------------------------------
 | GET whether it is applied
 |--------------------------------------------------------------------------
 */
router.get('/api/check_application/:id', ensureAuthenticated, function(req, res) {
  mysql.query('SELECT * FROM openmind.discussionApplications WHERE discussionId = ? and userId = ?', [req.id, req.userId], function(err, rows) {
    if (err) throw err;
    return res.send({
      length: rows.length ? true : false
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | GET User's discussion applications
 |--------------------------------------------------------------------------
 */
router.get('/api/discussion_applications', ensureAuthenticated, function(req, res) {
  var sql = 'SELECT b.discussionId, b.title, b.startTime, b.imageUrl, b.price ' +
    'FROM openmind.discussionApplications a, openmind.discussions b ' +
    'WHERE a.discussionId = b.discussionId AND a.userId = ?';
  mysql.query(sql, [req.userId], function(err, rows) {
    if (err) throw err;
    return res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Upload Avatar
 |--------------------------------------------------------------------------
 */
router.post('/api/upload_avatar', ensureAuthenticated, function(req, res) {
  var form = new formidable.IncomingForm();
  var userId = req.userId;
  form.parse(req, function(err, fields, files) {
    var file = files.file;
    var tempPath = file.path;
    var fileName = userId + '_avatar_' + moment().unix() + path.extname(file.name);
    var rootDir = __dirname + '/../../angular-part/app/';
    // var targetPath = path.resolve('./public/avatars/' + fileName);
    var targetPath = path.join(rootDir, '/public/avatars/', fileName);
    // store the url in the database
    mysql.query('SELECT * FROM openmind.users WHERE userId = ?', [req.userId], function(err, result) {
      if (err) throw err;
      var user = result[0];
      if (path.basename(user.imageUrl) != 'default_avatar.png') {
        fs.unlink(path.join(rootDir, user.imageUrl), function(err) {
          if (err) throw err;
        });
      }
      fs.rename(tempPath, targetPath, function(err) {
        if (err) throw err;
        // update imageUrl
        mysql.query('UPDATE openmind.users SET imageUrl = ? WHERE userId = ?', [path.join('/public/avatars/', fileName), req.userId], function(err, result) {
          if (err) throw err;
          res.send();
        });
      })
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | POST the appointment message
 |--------------------------------------------------------------------------
 */
router.post('/api/make_appointment', ensureAuthenticated, function(req, res) {
  var message = req.body;
  message.userId = req.userId;
  mysql.query('INSERT INTO openmind.appointments SET ?', message, function(err, rows) {
    if (err) throw err;
    return res.send();
  });
});

/*
 |--------------------------------------------------------------------------
 | GET all appointments
 |--------------------------------------------------------------------------
 */
router.get('/api/appointments', ensureAuthenticated, function(req, res) {
  var sql = 'SELECT a.*, b.title, b.peerId ' +
    'FROM openmind.appointments a, openmind.topics b ' +
    'WHERE a.topicId = b.topicId';
  mysql.query(sql, function(err, rows) {
    if (err) throw err;
    for (i in rows) {
      var appointment = rows[i];
      if (appointment.times) {
        appointment.times = appointment.times.split(',');
      }
    }
    return res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.post('/auth/login', function(req, res) {
  mysql.query("SELECT * FROM openmind.users WHERE email = ?", [req.body.email], function(err, result) {
    if (!result.length) {
      return res.status(401).send({
        message: '邮箱或密码错误'
      });
    }
    var user = result[0];
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          message: '邮箱或密码错误'
        });
      }
      res.send({
        token: createJWT(user)
      });
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/auth/signup', function(req, res) {
  mysql.query("SELECT * FROM openmind.users WHERE email = ?", [req.body.email], function(err, result) {
    if (result.length) {
      return res.status(409).send({
        message: '邮箱已经被占用'
      });
    }
    var user = {
      name: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
    var hash_password;
    // hash password
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        user.password = hash;
        mysql.query("INSERT INTO openmind.users SET ?", user, function(err, result) {
          if (err) {
            throw (err);
          }
          user.userId = result.insertId;
          res.send({
            token: createJWT(user)
          });
        })
      });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Get a user's information
 |--------------------------------------------------------------------------
 */
router.get('/content/users/:id', function(req, res) {
  mysql.query('SELECT * FROM openmind.users WHERE userId = ?', req.id, function(err, rows) {
    if (err) throw err;
    if (!rows.length) {
      res.status(404).send();
      return;
    }
    var user = rows[0];
    delete user.password;
    delete user.balance;
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get All Broadcasts
 |--------------------------------------------------------------------------
 */
router.get('/content/broadcasts', function(req, res) {
  mysql.query('SELECT * FROM openmind.broadcasts', function(err, rows) {
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get a Broadcast by id
 |--------------------------------------------------------------------------
 */
router.get('/content/broadcasts/:id', function(req, res) {
  mysql.query('SELECT * FROM openmind.broadcasts WHERE broadcastId = ?', req.id, function(err, rows) {
    if (err) throw (err);
    if (!rows.length) {
      res.status(404).send();
      return;
    }
    res.send(rows[0]);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get All Discussions
 |--------------------------------------------------------------------------
 */
router.get('/content/discussions', function(req, res) {
  mysql.query('SELECT * FROM openmind.discussions', function(err, rows) {
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get a Discussion by id
 |--------------------------------------------------------------------------
 */
router.get('/content/discussions/:id', function(req, res) {
  mysql.query('SELECT * FROM openmind.discussions WHERE discussionId = ?', req.id, function(err, rows) {
    if (err) throw (err);
    if (!rows.length) {
      res.status(404).send();
      return;
    }
    res.send(rows[0]);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get All Broadcast Comments by broadcast id
 |--------------------------------------------------------------------------
 */
router.get('/content/broadcast_comments/:id', function(req, res) {
  // SELECT a.broadcastCommentsId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl
  //   FROM openmind.broadcastComments a, openmind.users b
  //   where a.userId = b.userId and a.broadcastId = 2;
  var sql = 'SELECT a.broadcastCommentsId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl ' +
    'FROM openmind.broadcastComments a, openmind.users b ' +
    'WHERE a.userId = b.userId and a.broadcastId = ?';
  mysql.query(sql, [req.id], function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Get All Discussion Comments by discussion id
 |--------------------------------------------------------------------------
 */
router.get('/content/discussion_comments/:id', function(req, res) {
  // SELECT a.broadcastCommentsId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl
  //   FROM openmind.broadcastComments a, openmind.users b
  //   where a.userId = b.userId and a.broadcastId = 2;
  var sql = 'SELECT a.discussionCommentId, a.commentTime, a.content, a.likeNum, b.userId, b.name, b.imageUrl ' +
    'FROM openmind.discussionComments a, openmind.users b ' +
    'WHERE a.userId = b.userId and a.discussionId = ?';
  mysql.query(sql, [req.id], function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Get Broadcast Likes by id
 |--------------------------------------------------------------------------
 */
router.get('/api/broadcast_comments_liked', ensureAuthenticated, function(req, res) {
  // SELECT * FROM openmind.broadcastCommentsLikes where userId = 29;
  mysql.query('SELECT * FROM openmind.broadcastCommentsLikes where userId = ?', req.userId, function(err, rows) {
    if (err) throw (err);
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get Formum Likes by id
 |--------------------------------------------------------------------------
 */

router.get('/api/forum_comments_liked', ensureAuthenticated, function(req, res) {
  // SELECT * FROM openmind.broadcastCommentsLikes where userId = 29;
  // console.log("req.userId: "+req.userId=="undefined");
  mysql.query('SELECT * FROM openmind.forumCommentsLikes where userId = ?', req.userId, function(err, rows) {
    if (err) throw (err);
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get Discussion Likes by id
 |--------------------------------------------------------------------------
 */
router.get('/api/discussion_comments_liked', ensureAuthenticated, function(req, res) {
  // SELECT * FROM openmind.broadcastCommentsLikes where userId = 29;
  mysql.query('SELECT * FROM openmind.discussionCommentsLikes where userId = ?', req.userId, function(err, rows) {
    if (err) throw (err);
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Post a Broadcast comment
 |--------------------------------------------------------------------------
 */
router.post('/content/broadcast_comments/:id', ensureAuthenticated, function(req, res) {
  // INSERT INTO `openmind`.`broadcastComments` (`content`, `userId`, `broadcastId`) VALUES ('abcdefghijklmnopqrstuvwxyz', '29', '2');
  var comment = {
    content: req.body.content,
    userId: req.userId,
    broadcastId: req.id
  };
  mysql.query('INSERT INTO openmind.broadcastComments SET ?', comment, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Post a Forum comment
 |--------------------------------------------------------------------------
 */
router.post('/content/forum_comments/:id', ensureAuthenticated, function(req, res) {
  // INSERT INTO `openmind`.`broadcastComments` (`content`, `userId`, `broadcastId`) VALUES ('abcdefghijklmnopqrstuvwxyz', '29', '2');
  //console.log("req:"+req);
  var comment = {
    content: req.body.content,
    userId: req.userId,
    forumId: req.id
  };
  //console.log("userId:"+req.userId);
  mysql.query('INSERT INTO openmind.forumComments SET ?', comment, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

router.post('/api/postForum', ensureAuthenticated, function(req, res){
  var forum = {
    content: req.body.forumContent,
    title: req.body.forumHeader,
    userId: req.userId
  };
  //console.log("post forum:"+req.name);
  mysql.query('INSERT INTO openmind.forum SET ?', forum, function(err, rows){
    if(err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Post a Forum commentincomment
 |--------------------------------------------------------------------------
 */

 router.post('/content/forum_commentincomment/:id', ensureAuthenticated, function(req, res) {
  // INSERT INTO `openmind`.`broadcastComments` (`content`, `userId`, `broadcastId`) VALUES ('abcdefghijklmnopqrstuvwxyz', '29', '2');
  var comment = {
    content: req.body.content,
    userId: req.userId,
    forumCommentId: req.id,
    forumId: req.body.forumId

  };
  mysql.query('INSERT INTO openmind.forumCommentInComment SET ?', comment, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Post a Discussion comment
 |--------------------------------------------------------------------------
 */
router.post('/content/discussion_comments/:id', ensureAuthenticated, function(req, res) {
  // INSERT INTO `openmind`.`broadcastComments` (`content`, `userId`, `broadcastId`) VALUES ('abcdefghijklmnopqrstuvwxyz', '29', '2');
  var comment = {
    content: req.body.content,
    userId: req.userId,
    discussionId: req.id
  };
  mysql.query('INSERT INTO openmind.discussionComments SET ?', comment, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  })
});

/*
 |--------------------------------------------------------------------------
 | Like a Broadcast comment
 |--------------------------------------------------------------------------
 */
router.post('/content/like_broadcast_comments/:id', ensureAuthenticated, function(req, res) {
  // check whether already liked
  // INSERT INTO `openmind`.`broadcastCommentsLikes` (`broadcastCommentsId`, `userId`) VALUES ('2', '29');
  var like = {
    broadcastCommentsId: req.id,
    userId: req.userId
  };
  mysql.query('INSERT INTO openmind.broadcastCommentsLikes SET ?', like, function(err, rows) {
    if (err) throw err;
    // UPDATE openmind.broadcastComments SET likeNum = likeNum+1 WHERE broadcastCommentsId = 2
    mysql.query('UPDATE openmind.broadcastComments SET likeNum = likeNum+1 WHERE broadcastCommentsId = ?', [req.id]);
    res.send();
  })
});

/*
 |--------------------------------------------------------------------------
 | Like a Forum comment
 |--------------------------------------------------------------------------
 */
router.post('/content/like_forum_comments/:id', ensureAuthenticated, function(req, res) {
  // check whether already liked
  // INSERT INTO `openmind`.`broadcastCommentsLikes` (`broadcastCommentsId`, `userId`) VALUES ('2', '29');
  var like = {
    forumCommentId: req.id,
    userId: req.userId
  };
  mysql.query('INSERT INTO openmind.forumCommentsLikes SET ?', like, function(err, rows) {
    if (err) throw err;
    // UPDATE openmind.broadcastComments SET likeNum = likeNum+1 WHERE broadcastCommentsId = 2
    mysql.query('UPDATE openmind.forumComments SET likeNum = likeNum+1 WHERE forumCommentId = ?', [req.id]);
    res.send();
  })
});

/*
 |--------------------------------------------------------------------------
 | Like a Discussion comment
 |--------------------------------------------------------------------------
 */
router.post('/content/like_discussion_comments/:id', ensureAuthenticated, function(req, res) {
  // check whether already liked
  // INSERT INTO `openmind`.`broadcastCommentsLikes` (`broadcastCommentsId`, `userId`) VALUES ('2', '29');
  var like = {
    discussionCommentId: req.id,
    userId: req.userId
  };
  mysql.query('INSERT INTO openmind.discussionCommentsLikes SET ?', like, function(err, rows) {
    if (err) throw err;
    // UPDATE openmind.broadcastComments SET likeNum = likeNum+1 WHERE broadcastCommentsId = 2
    mysql.query('UPDATE openmind.discussionComments SET likeNum = likeNum+1 WHERE discussionCommentId = ?', [req.id]);
    res.send();
  })
});


/*
 |--------------------------------------------------------------------------
 | Get All Peers
 |--------------------------------------------------------------------------
 */
router.get('/content/peers', function(req, res) {
  mysql.query('SELECT * FROM openmind.peers', function(err, rows) {
    for (i in rows) {
      var peer = rows[i];
      if (peer.tags) {
        peer.peer_tags = peer.tags.split(',');
      }
    }
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get a Peer by id
 |--------------------------------------------------------------------------
 */
router.get('/content/peers/:id', function(req, res) {
  mysql.query('SELECT * FROM openmind.peers WHERE peersId = ?', req.id, function(err, rows) {
    if (err) throw (err);
    if (!rows.length) {
      res.status(404).send();
      return;
    }
    var peer = rows[0];
    if (peer.tags) {
      peer.peer_tags = peer.tags.split(',');
    }
    res.send(peer);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get peer topics by peerid
 |--------------------------------------------------------------------------
 */
router.get('/content/peer_topics/:id', function(req, res) {
  mysql.query('SELECT * FROM openmind.topics where peerId = ?', [req.id], function(err, rows) {
    if (err) throw err;
    for (i in rows) {
      var topic = rows[i];
      if (topic.tags) {
        topic.topic_tags = topic.tags.split(',');
      }
    }
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get all topics
 |--------------------------------------------------------------------------
 */
router.get('/content/topics', function(req, res) {
  var sql = 'SELECT a.*, b.name, b.imageUrl ' +
    'FROM openmind.topics a, openmind.peers b ' +
    'WHERE a.peerId = b.peersId';
  mysql.query(sql, function(err, rows) {
    if (err) throw err;
    for (i in rows) {
      var topic = rows[i];
      if (topic.tags) {
        topic.topic_tags = topic.tags.split(',');
      }
    }
    res.send(rows);
  });
});

/*
 |--------------------------------------------------------------------------
 | Get all topics
 |--------------------------------------------------------------------------
 */
router.get('/content/topics/:id', ensureAuthenticated, function(req, res) {
  var sql = 'SELECT a.*, b.name, b.imageUrl ' +
    'FROM openmind.topics a, openmind.peers b ' +
    'WHERE a.peerId = b.peersId and a.topicId = ?';
  mysql.query(sql, req.id, function(err, rows) {
    if (err) throw err;
    if (!rows.length) {
      res.status(404).send();
    }
    var topic = rows[0];
    if (topic.tags) {
      topic.topic_tags = topic.tags.split(',');
    }
    res.send(topic);
  });
});

// to the admin page
router.post('/admin_login',function(req,res){
  console.log("WeW");
  mysql.query("SELECT * FROM openmind.admin WHERE username = ?", [req.body.username], function(err, result){
    if(!result.length){
      return res.status(401).send({
        message: 'The username is wrong'
      });
    }
    var username = result[0];
    if(username.password == req.body.password){
      console.log("userid: "+username.id);
      mysql.query("SELECT * FROM openmind.messages WHERE userId = ?", [username.id], function(err, result){
         var message = result.length;

        // console.log("Inside "+result);
        return res.send({
          message: message,
          loginusername: username.username,
          token: 'You have log in successfully'
        });
      });
    }
    else{
      return res.status(401).send({
        message: 'You password is wrong'
      });
      
    }
  });
});

router.post('/api/sendOne', ensureAuthenticated,function(req,res){
  mysql.query("SELECT * FROM openmind.users WHERE name = ?", [req.body.person], function(err, result){
    if(!result.length){
      console.log("Person do not exist");
      return res.status(401).send({
        message: 'Are you sure you want to send to this person?'
      });
    }
    else{
		console.log(result[0].userId);
		console.log(req.body);
		mysql.query("INSERT INTO openmind.messages (content, targetUrl,userId) VALUES (?, ?,?)", [req.body.content, req.body.targetUrl,result[0].userId], function(err, result){
      });
	return res.send({
            token: 'You have sent to all the user a message successfully'
          });
    }
  });
});

router.post('/api/sendAll',ensureAuthenticated, function(req,res){
  console.log("send to nodejs sendAll");
  mysql.query("SELECT * FROM openmind.users", function(err, result){
    if(!result.length){
      return res.status(401).send({
        message: "No user find in the database"
      }); 
    }
    else{
      var length = result.length;
      for(var i = 0; i < length; i++){
        var current = result[i].userId;
        mysql.query("INSERT INTO openmind.messages(content,targetUrl, userId) VALUES (?,?, ?)", [req.body.content,req.body.targetUrl, current], function(err, result){
          console.log("result: "+result);
        });

      }
      return res.send({
            token: 'You have sent to all the user a message successfully'
          });
    }
  });
});


router.get('/api/applications', ensureAuthenticated, function(req, res) {
  mysql.query("SELECT * FROM openmind.applicationToBePeer where userID in (select userId from openmind.users where userType = 1)",function(err, rows) {
    res.send(rows);
  });
});

router.post('/api/approveApply',ensureAuthenticated,function(req,res){
	console.log("123" + req.body.userID);
	mysql.query("select users.userID,name,cv,city,imageUrl,education,tags,keyWords from openmind.users join openmind.applicationToBePeer where users.userid = applicationToBePeer.userid and users.userID = ?",[req.body.userID],function(err,result){
	console.log("123" + result[0]);
	mysql.query("insert into openmind.peers (peersId,name,cv,city,imageUrl,education,tags,keyWords) values (?,?,?,?,?,?,?,?)",[result[0].userID,result[0].name,result[0].cv,result[0].city,result[0].imageUrl,result[0].education,result[0].tags,result[0].keyWords],function(err,result){
		console.log("456");
	});
	mysql.query("delete from openmind.applicationToBePeer where userID = ?",[result[0].userID],function(err,result){
		console.log("789");
	});
	mysql.query("insert into openmind.messages (content,targetUrl,userID) values ('Your application has been approved!','#/',?)",[result[0].userID],function(err,result){
		console.log("000");
	});
	mysql.query("update users set userType = 2 where userID = ?",[result[0].userID],function(err,result){
		console.log("111");
	});
	res.send();
	});
});

router.post('/api/rejectApply',ensureAuthenticated,function(req,res){
	console.log("123" + req.body.comments);
	console.log("123" + req.body.userID);
	mysql.query("update openmind.applicationToBePeer set comments = ? where userID = ?",[req.body.comments,req.body.userID],function(err,result){
		console.log("123");
	});
	mysql.query("update openmind.users set userType = 0 where userID = ?",[req.body.userID],function(){
		console.log("456");
	});
	mysql.query("insert into openmind.messages (content,targetUrl,userID) values ('Your application has been rejected!','#/application',?)",[req.body.userID],function(err,result){
		console.log("000");
	});
	res.send();

});
router.get('/api/weixin/:code', function(req,res){
  console.log("Here you will start to log in weixin.");
  var AppId = "wxa4aedc705b3fc018";
    var AppSecret = "dcf98be8210b46ab773882b22409fcd8";
    var openidUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppId
        + '&secret=' + AppSecret
        + '&code='+code
        + '&grant_type=authorization_code';
        nodegrass.get(openidUrl,function(data,status,headers){
 
        var access_token_info = JSON.parse(data);
        var access_token = access_token_info.access_token;
        var openid = access_token_info.openid;
        var getUserInfo = 'https://api.weixin.qq.com/sns/userinfo?access_token='
            + access_token + '&openid=' + openid + '&lang=zh_CN';
        nodegrass.get(getUserInfo,function(data,status,headers){
            console.log(data);
            res.render('userinfo', JSON.parse(data));
        },'utf8').on('error', function(e) {
            console.log("Got error: " + e.message);
        });
 
    },'utf8').on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

router.get('/api/weixinBang/:id', function(req, res) {
  //   mysql.query("SELECT * FROM openmind.forum a, openmind.users b WHERE a.userId = b.userId", function(err, rows) {
  //   //console.log(rows);
  //   res.send(rows);
  // });
// console.log(document.url);
res.send("wow");
});

// adminpageend


router.get('/', function(req, res) {
  res.sendfile('index.html');
});

module.exports = router;
