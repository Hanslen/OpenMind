'use strict';

angular.module('myApp.dashboard_message', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/message', {
    templateUrl: 'dashboard/dashboard_message.html',
    controller: 'dashboardMessageCtrl',
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

.controller('dashboardMessageCtrl', ['$scope', '$auth', 'User', 'Notification', '$route', 'Message', function($scope, $auth, User, Notification, $route, Message) {
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

    Message.query_all_messages(function(response) {
      $scope.all_messages = response;
    });
  }

  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

}]);
