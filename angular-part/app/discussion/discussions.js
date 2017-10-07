'use strict';

angular.module('myApp.discussions', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/discussions', {
    templateUrl: 'discussion/discussions.html',
    controller: 'discussionsCtrl'
  });
}])

.controller('discussionsCtrl', ['$scope', '$auth', 'Discussion', 'User', 'Notification', 'Message', function($scope, $auth, Discussion, User, Notification, Message) {
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

  var discussions = Discussion.query(function() {
    $scope.discussions = discussions;
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.total = $scope.discussions.length;
    $scope.pagedItems = $scope.discussions.slice($scope.currentPage * $scope.itemsPerPage,
      $scope.itemsPerPage);
  });

  $scope.loadMore = function() {
    $scope.currentPage++;
    var discussions = $scope.discussions;
    var newItems = $scope.discussions.slice($scope.currentPage * $scope.itemsPerPage,
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
