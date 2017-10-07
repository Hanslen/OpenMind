'use strict';

angular.module('myApp.appointment', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/appointment/:topicId', {
    templateUrl: 'appointment/appointment.html',
    controller: 'appointmentCtrl'
  });
}])

.controller('appointmentCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Peer', '$location', 'Notification', 'Message', 'Topic', function($scope, $routeParams, $auth, User, Peer, $location, Notification, Message, Topic) {

  Topic.get($routeParams.topicId, function(response) {
    $scope.topic = response;
  }, function() {
    Notification.error('未找到该话题');
    $location.path('/peers');
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
    Message.view_message(message.messageId, function() {});
  }

  $scope.selected_time = [];

  $scope.add_time = function(date) {
    if (!date) {
      Notification.error('请先选择时间');
      return;
    }
    if ($scope.selected_time.indexOf(date) != -1) {
      Notification.error('已经添加过');
      return;
    }
    $scope.selected_time.push(date);
  }

  $scope.make_appointment = function() {
    if (!$scope.selected_time.length) {
      Notification.error('请选择预约时间');
      return;
    }
    if (!$scope.comment_content) {
      $scope.comment_content = '';
    }
    var message = {
      topicId: $routeParams.topicId,
      peerId: $scope.topic.peerId,
      times: $scope.selected_time.toString(),
      comment: $scope.comment_content
    };

    User.make_appointment(message, function() {
      Notification.success('成功预约，请等待导师回复');
      $location.path('/');
    });
  }
}]);
