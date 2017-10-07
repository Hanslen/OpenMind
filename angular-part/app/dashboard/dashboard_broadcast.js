'use strict';

angular.module('myApp.dashboard_broadcast', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/broadcast', {
    templateUrl: 'dashboard/dashboard_broadcast.html',
    controller: 'dashboardBroadcastCtrl',
    resolve: {
      authenticated: function($q, $location, $auth, Notification) {
        var deferred = $q.defer();
        if (!$auth.isAuthenticated()) {
          $location.path('/login');
          Notification.error('请您先登录');
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      }
    }
  });
}])

.controller('dashboardBroadcastCtrl', ['$scope', '$auth', 'User', 'Notification', '$route', 'Message', function($scope, $auth, User, Notification, $route, Message) {
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

  // get all broadcasts
  User.get_broadcast_collections(function(broadcasts) {
    $scope.broadcasts = broadcasts;
  });

  // delete the broadcast from collections
  $scope.deleteBroadcast = function(broadcast, broadcastId) {
    User.delete_broadcast_collections(broadcastId, function() {
      // success
      Notification.success('您已成功删除');
    });
    // $route.reload();
    $scope.broadcasts.splice($scope.broadcasts.indexOf(broadcast), 1);
  }
}]);
