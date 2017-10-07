'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'searchCtrl'
  });
  $routeProvider.when('/search/:searchContent', {
    templateUrl: 'search/search.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope', '$auth', 'Peer', 'User', 'Notification', 'Message', 'Topic', '$routeParams', 'DataService', function($scope, $auth, Peer, User, Notification, Message, Topic, $routeParams, DataService) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    if (!$auth.isAuthenticated()) {
      return;
    }
    $auth.logout().then(function() {
      Notification.success('您已退出登录');
    });
  }

  if ($auth.isAuthenticated()) {
    var user = User.get(function(user) {
      $scope.user = user;
    });

    Message.query_unviewed_messages(function(response) {
      $scope.messages = response;
    });
  }

  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

  var peers = Peer.query(function() {
    angular.forEach(peers, function(peer) {
      if (peer.peer_tags) {
        peer.peer_tags_translated = [];
        angular.forEach(peer.peer_tags, function(tag) {
          peer.peer_tags_translated.push(DataService.peer_tags_translate(tag));
        });
      }
    });
    $scope.peers = peers;
  });

  Topic.query_all(function(response) {
    angular.forEach(response, function(topic) {
      if (topic.topic_tags) {
        topic.topic_tags_translated = [];
        angular.forEach(topic.topic_tags, function(tag) {
          topic.topic_tags_translated.push(DataService.topic_tags_translate(tag));
        });
      }
    });
    $scope.topics = response;
  });

  if ($routeParams.searchContent) {
    $scope.searchText = $routeParams.searchContent;
  }

}]);
