angular.module('myApp').factory('Topic', function($http) {
  // return $resource('/content/broadcasts/:id'); // Note the full endpoint address
  var factory = {};
  factory.query = function(peerId, callback, callback_failure) {
    $http.get('/content/peer_topics/' + peerId).then(function(response) {
      callback(response.data);
    }, function(response) {
      callback_failure(response.data);
    });
  }

  factory.query_all = function(callback) {
    $http.get('/content/topics/').then(function(response) {
      callback(response.data);
    });
  }

  factory.get = function(topicId, callback, callback_failure) {
    $http.get('/content/topics/' + topicId).then(function(response) {
      callback(response.data);
    }, function() {
      callback_failure();
    });
  }
  return factory;
});
