angular.module('myApp').factory('Message', function($http) {
  var factory = {};
  factory.query_unviewed_messages = function(callback) {
    $http.get('/api/unviewed_message').then(function(response) {
      callback(response.data);
    }, function(response) {
      callback(response.data);
    });
  }

  factory.query_all_messages = function(callback) {
    $http.get('/api/message').then(function(response) {
      callback(response.data);
    }, function(response) {
      callback(response.data);
    });
  }

  factory.view_message = function(messageId, callback) {
    $http.post('/api/view_message/' + messageId).then(function(response) {
      callback();
    });
  }
  return factory;
});
