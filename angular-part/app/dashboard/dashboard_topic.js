// pai code

'use strict';

angular.module('myApp.dashboard_topic', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/topic', {
    templateUrl: 'dashboard/dashboard_topic.html',
    controller: 'dashboardTopicCtrl',
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

.controller('dashboardTopicCtrl', ['$scope', '$auth', 'User', 'Notification', '$route', 'Message', function($scope, $auth, User, Notification, $route, Message) {
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

  // get all topics
  User.get_topic_collections(function(topics) {
    console.log(topics[0]);
    $scope.topics = topics;
  });

    // delete the broadcast from collections
  $scope.deleteTopic = function(topic, topicId) {
    User.delete_topic_collections(topicId, function() {
      // success
      Notification.success('您已成功删除该话题');
    });
    // $route.reload();
    $scope.topics.splice($scope.topics.indexOf(topic), 1);
  }

}]);
// pai end