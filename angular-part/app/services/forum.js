angular.module('myApp').factory('Forum', function($http) {
  var factory = {};

  factory.query_all_forums = function(callback) {
    $http.get('/api/forums').then(function(response) {
      callback(response.data);
    }, function(response) {
      callback(response.data);
    });
  }

  factory.query_one_forums = function(forumId, callback){
    $http.get('/api/forum/'+forumId).then(function(response){
      callback(response.data);
    },function(response){
      callback(response.data);
    });
  }

  factory.get_comments = function(forumId, callback){
    $http.get('/api/forum_comments/'+forumId).then(function(response){
      callback(response.data);
    },function(response){
      callback(response.data);
    });
  }

  factory.get_incomments = function(commentId, callback){
    $http.get('/api/forum_incomments/'+commentId).then(function(response){
      callback(response.data);
    },function(response){
      callback(response.data);
    });
  }

  factory.getAllinComments = function(callback){
    $http.get('/api/forum_allincomments').then(function(response){
      callback(response.data);
    }, function(response){
      callback(response.data);
    });
  } 

  factory.get_forum_comments_liked = function(callback){
    $http.get('/api/forum_comments_liked').then(function(response) {
      callback(response.data);
    });
  }

  factory.like = function(forumId, callback) {
    $http.post('/content/like_forum_comments/' + forumId).then(function() {
      callback();
    });
  }

  factory.post = function(forumId, content, callback) {
    $http.post('/content/forum_comments/' + forumId, {content: content}).then(function() {
      callback();
    });
  }
  factory.postincomments = function(forumId,commentId, content, callback) {
    $http.post('/content/forum_commentincomment/' + commentId, {forumId:forumId,content: content}).then(function() {
      callback();
    });
  }

  factory.postForum = function(forumHeader, forumContent, callback){
      $http.post('/api/postForum', {forumHeader:forumHeader, forumContent:forumContent}).then(function(){
          callback();
      });
  }

  factory.deleteForumComment = function(forumCommentId, callback){
    $http.delete('/api/deleteForumComment/'+ forumCommentId).then(function(){
      callback();
    });
  }

  factory.deleteForumCommentinComment = function(incommentId, callback){
    $http.delete('/api/deleteForumCommentinComment/'+incommentId).then(function(){
        callback();
    });
  }

  return factory;
});
