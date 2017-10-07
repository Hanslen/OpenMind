'use strict';

angular.module('myApp.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'signup/signup.html',
    controller: 'signupCtrl',
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

.controller('signupCtrl', ['$scope', '$auth', 'Notification', '$location', function($scope, $auth, Notification, $location) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    if (!$auth.isAuthenticated()) {
      return;
    }
    $auth.logout();
  }
  $scope.signup = function() {
    // before POST
    if (!$scope.user || !$scope.user.username || !$scope.user.email || !$scope.user.password || !$scope.password_again) {
      $scope.error_message = '请完整填写表格';
      return;
    }

    if ($scope.user.password != $scope.password_again) {
      $scope.error_message = '两次输入的密码不同';
      return;
    }

    $auth.signup($scope.user).then(function() {
      Notification.success('注册成功');
      $location.path('/');
    }).catch(function(response) {
      $scope.error_message = response.data.message;
    });
  }
}]);
