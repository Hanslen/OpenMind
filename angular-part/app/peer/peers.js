'use strict';

angular.module('myApp.peers', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/peers', {
    templateUrl: 'peer/peers.html',
    controller: 'peersCtrl'
  });
}])

.controller('peersCtrl', ['$scope', '$auth', 'Peer', 'User', 'Notification', 'Message', function($scope, $auth, Peer, User, Notification, Message) {
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
    $scope.peers = peers;
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.total = $scope.peers.length;
    $scope.pagedItems = $scope.peers.slice($scope.currentPage * $scope.itemsPerPage,
      $scope.itemsPerPage);
  });

  $scope.loadMore = function() {
    $scope.currentPage++;
    var peers = $scope.peers;
    var newItems = $scope.peers.slice($scope.currentPage * $scope.itemsPerPage,
      $scope.currentPage * $scope.itemsPerPage + $scope.itemsPerPage);
    $scope.pagedItems = $scope.pagedItems.concat(newItems);
  };

  $scope.nextPageDisabledClass = function() {
    return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.total / $scope.itemsPerPage);
  };
}]);
