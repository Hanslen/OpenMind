'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl',
    resolve: {
      authenticated: function($q, $location, $auth, Notification) {
        var deferred = $q.defer();

        if ($auth.isAuthenticated()) {
          Notification.error('您已登录');
          $location.path('/');
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      }
    }
  });
}])

.controller('loginCtrl', ['$scope', '$auth', 'Notification', '$location', function($scope, $auth, Notification, $location) {

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    if (!$auth.isAuthenticated()) {
      return;
    }
    $auth.logout();
  }

  $scope.login = function() {
    // checking before POST
    if (!$scope.user || !$scope.user.email || !$scope.user.password) {
      $scope.error_message = 'Please fill in username and password';
      return;
    }

    // login POST
    $auth.login($scope.user)
      .then(function() {
        Notification.success('登录成功');
        $location.path('/');
      })
      .catch(function(response) {
        $scope.error_message = response.data.message;
      });
  };
}]);
