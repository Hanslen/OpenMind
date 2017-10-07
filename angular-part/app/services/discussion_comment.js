angular.module('myApp').factory('DiscussionComment', function($http) {
  var factory = {};
  factory.get = function(discussionId, callback) {
    $http.get('/content/discussion_comments/' + discussionId).then(function(response) {
      callback(response.data);
    });
  }

  factory.post = function(discussionId, content, callback) {
    $http.post('/content/discussion_comments/' + discussionId, {content: content}).then(function() {
      callback();
    });
  }

  factory.like = function(discussionId, callback) {
    $http.post('/content/like_discussion_comments/' + discussionId).then(function() {
      callback();
    });
  }

  factory.deleteDiscussionComment = function(discussionCommentId, callback){
    $http.delete('/content/deleteDiscussionComment/'+discussionCommentId).then(function(){
        console.log(discussionCommentId);
        callback();
    });
  }

  return factory;
});
