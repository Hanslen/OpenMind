'use strict';

angular.module('myApp.broadcasts', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/broadcasts', {
    templateUrl: 'broadcast/broadcasts.html',
    controller: 'broadcastsCtrl'
  });
}])

.controller('broadcastsCtrl', ['$scope', '$auth', 'Broadcast', 'User', 'Notification', 'Message','$location', function($scope, $auth, Broadcast, User, Notification, Message, $location) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.checkLogin = function(broadcastId){
    if($auth.isAuthenticated()){
      $location.path('/broadcasts/'+broadcastId);
    }
    else{
        alert("需要您登陆后才能浏览");
        $location.path('/login');
    }
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

  var broadcasts = Broadcast.query(function() {
    $scope.broadcasts = broadcasts;
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.total = $scope.broadcasts.length;
    $scope.pagedItems = $scope.broadcasts.slice($scope.currentPage * $scope.itemsPerPage,
      $scope.itemsPerPage);
  });

  $scope.loadMore = function() {
    $scope.currentPage++;
    var broadcasts = $scope.broadcasts;
    var newItems = $scope.broadcasts.slice($scope.currentPage * $scope.itemsPerPage,
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
