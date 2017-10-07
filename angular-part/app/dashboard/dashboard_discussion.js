'use strict';

angular.module('myApp.dashboard_discussion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/discussion', {
    templateUrl: 'dashboard/dashboard_discussion.html',
    controller: 'dashboardDiscussionCtrl',
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

.controller('dashboardDiscussionCtrl', ['$scope', '$auth', 'User', 'Notification', '$route', 'Message', function($scope, $auth, User, Notification, $route, Message) {
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

    // get all discussions
    User.get_discussion_collections(function(discussions) {
      $scope.discussions = discussions;
    });

    User.get_discussion_applications(function(discussions) {
      $scope.discussion_applications = discussions;
    })
  }

  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

  // delete the broadcast from collections
  $scope.deleteDiscussion = function(discussion, discussionId) {
    User.delete_discussion_collections(discussionId, function() {
      // success
      Notification.success('您已成功删除');
    });
    // $route.reload();
    $scope.discussions.splice($scope.discussions.indexOf(discussion), 1);
  }
}]);
