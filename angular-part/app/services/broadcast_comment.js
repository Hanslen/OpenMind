angular.module('myApp').factory('BroadcastComment', function($http) {
  var factory = {};
  factory.get = function(broadcastId, callback) {
    $http.get('/content/broadcast_comments/' + broadcastId).then(function(response) {
      callback(response.data);
    });
  }

  factory.post = function(broadcastId, content, callback) {
    $http.post('/content/broadcast_comments/' + broadcastId, {content: content}).then(function() {
      callback();
    });
  }

  factory.like = function(broadcastId, callback) {
    $http.post('/content/like_broadcast_comments/' + broadcastId).then(function() {
      callback();
    });
  }

  factory.deleteBroadcastComment = function(broadcastCommentsId, callback){
    $http.delete('/content/broadcastCommentsId/'+broadcastCommentsId).then(function(){
        callback();
    });
  }

  return factory;
});
