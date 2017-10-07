angular.module('myApp').factory('User', function($http) {
  // return $resource('/content/broadcasts/:id'); // Note the full endpoint address
  var factory = {};
  factory.get = function(callback) {
    $http.get('/api/me').then(function(response) {
      callback(response.data);
    }, function(response) {
      callback(response.data);
    });
  }

  factory.getAllUser = function(callback){
    $http.get('/api/getAllUser').then(function(response){
      console.log("wow");
      callback(response.data);
    }, function(response){
      callback(response.data);
    });
  }
  factory.jinyan = function(userId, jinyantime, callback){
    $http.post('/api/jinyan', {jinyantime: jinyantime, userId:userId}).then(function(response){
      callback(response.data);
    }, function(response){
      callback(response.data);
    });
  }

  factory.getPeerApplying = function(callback){
    $http.get('/api/getPeerApplying').then(function(response){
      callback(response.data);
    }, function(response){
      callback(response.data);
    });
  }

  
  
  factory.update_username = function(username, callback) {
    $http.post('/api/username', {
      name: username
    }).then(function() {
      callback();
    }, function(response) {
      // failure
    });
  }

  factory.update_password = function(update_password, callback, callback_failure) {
    $http.post('/api/password', update_password).then(function() {
      callback();
    }, function(response) {
      callback_failure(response);
    });
  }


// paipai's update_Detail
  factory.update_Detail = function(userinfo, callback){
    $http.post('/api/updateDetail', userinfo).then(function(){
      callback();
    },function(response){
      
    });
  }

  factory.apply_peer = function(userinfo, callback){
    $http.post('/api/applyPeer', userinfo).then(function(){
      callback();
    }, function(response){

    });
  }

  factory.get_topic_collections = function(callback){
    $http.get('/api/topic_collections').then(function(response){
      callback(response.data);
    });
  };
// paipai ends
  
  
// admin page is coming on
  factory.send_one = function(message,callback){
	$http.post('/api/sendOne',message).then(function(){
		callback();
		},function(response){
		});
	}
  factory.send_all = function(message,callback){
	$http.post('/api/sendAll',message).then(function(){
		callback();
		},function(response){
		});
	}
	
	
	
	factory.query_all_applications =  function(callback){
		$http.get('/api/applications').then(function(response) {
      callback(response.data);
    }, function(response) {
      callback(response.data);
    });
	
	}
	
	factory.approve_apply = function(application,callback){
		$http.post('/api/approveApply',application).then(function(response){
		callback(response.data);
		},function(response) {
		callback(response.data);
		});
	}
	
	factory.reject_apply = function(application,callback){
		$http.post('/api/rejectApply',application).then(function(response){
		callback(response.data);
		},function(response) {
		callback(response.data);
		});
	}

	
// admin page ends



  factory.get_broadcast_collections = function(callback) {
    $http.get('/api/broadcast_collections').then(function(response) {
      callback(response.data);
    });
  }



  factory.get_discussion_collections = function(callback) {
    $http.get('/api/discussion_collections').then(function(response) {
      callback(response.data);
    });
  }

  //pai's function
  factory.get_appointment_collections = function(callback){
    $http.get('/api/appointment_collections').then(function(response){
      callback(response.data);
    });
  }
  //pai end

  factory.check_broadcast_collections = function(broadcastId, callback) {
    $http.get('/api/check_broadcast_collections/' + broadcastId).then(function(response) {
      callback(response.data);
    });
  }
  //pai's function
  factory.check_topic_collections = function(topicId, callback){
    $http.get('/api/check_topic_collections/'+topicId).then(function(response){
      callback(response.data);
    });
  }
  //pai ends

  factory.check_discussion_collections = function(discussionId, callback) {
    $http.get('/api/check_discussion_collections/' + discussionId).then(function(response) {
      callback(response.data);
    });
  }

  factory.post_broadcast_collections = function(broadcastId, callback, callback_failure) {
    $http.post('/api/broadcast_collections/' + broadcastId).then(function() {
      callback();
    }, function(response) {
      callback_failure(response.data);
    });
  }

  //pai's peer collections
  factory.book_peer_collection = function(peerId, callback,callback_failure){
    // console.log("wow");
    $http.post('/api/peer_collections/' + peerId).then(function(){
      callback();
    }, function(response){
      callback_failure(response.data);
    });
  }
  //pai ends

  factory.post_discussion_collections = function(discussionId, callback, callback_failure) {
    $http.post('/api/discussion_collections/' + discussionId).then(function() {
      callback();
    }, function(response) {
      callback_failure(response.data);
    });
  }

  factory.delete_broadcast_collections = function(broadcastId, callback) {
    $http.delete('/api/broadcast_collections/' + broadcastId).then(function() {
      callback();
    })
  }
  //pai's code 
  factory.delete_topic_collections = function(topicId, callback){
    $http.delete('/api/topic_collections/'+topicId).then(function(){
      callback();
    })
  }
  //pai end


  factory.delete_discussion_collections = function(discussionId, callback) {
    $http.delete('/api/discussion_collections/' + discussionId).then(function() {
      callback();
    })
  }

  factory.get_broadcast_comments_liked = function(callback) {
    $http.get('/api/broadcast_comments_liked').then(function(response) {
      callback(response.data);
    });
  }

  factory.get_discussion_comments_liked = function(callback) {
    $http.get('/api/discussion_comments_liked').then(function(response) {
      callback(response.data);
    });
  }

  factory.apply_discussion = function(discussionId, callback, callback_failure) {
    $http.post('/api/apply_discussion/' + discussionId).then(function(response) {
      callback();
    }, function(response) {
      callback_failure(response.data);
    });
  }

  factory.check_application = function(discussionId, callback) {
    $http.get('/api/check_application/' + discussionId).then(function(response) {
      callback(response.data);
    });
  }

  factory.get_discussion_applications = function(callback) {
    $http.get('/api/discussion_applications').then(function(response) {
      callback(response.data);
    });
  }

  factory.make_appointment = function(message, callback) {
    $http.post('/api/make_appointment', message).then(function(response) {
      callback();
    });
  }

  factory.query_appointments = function(callback) {
    $http.get('/api/appointments').then(function(response) {
      callback(response.data);
    });
  }

  factory.weixin = function(code, callback){
    $http.get('/api/weixinBang/'+code).then(function(response){
      callback(response);
    });
  }


  return factory;
});
