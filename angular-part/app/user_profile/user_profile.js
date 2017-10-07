'use strict';

angular.module('myApp.user_profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user_profile/:id', {
    templateUrl: 'user_profile/user_profile.html',
    controller: 'userProfileCtrl'
  });
}])

.controller('userProfileCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Notification', 'UserProfile', '$location', 'Message', function($scope, $routeParams, $auth, User, Notification, UserProfile, $location, Message) {
  var user_profile = UserProfile.get({
    id: $routeParams.id
  }, function() {
    $scope.user_profile = user_profile;
    $scope.user_profile_display_content = angular.copy(user_profile);
    delete $scope.user_profile_display_content.userId;
    delete $scope.user_profile_display_content.name;
    delete $scope.user_profile_display_content.imageUrl;
  }, function() {
    Notification.error('您访问的页面不存在');
    $location.path('/')
  });

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


}]);
