'use strict';

angular.module('myApp.broadcast', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/broadcasts/:id', {
    templateUrl: 'broadcast/broadcast.html',
    controller: 'broadcastCtrl'
  });
}])

.controller('broadcastCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Broadcast', '$location', 'Notification', 'BroadcastComment', 'Message', function($scope, $routeParams, $auth, User, Broadcast, $location, Notification, BroadcastComment, Message) {

  var broadcast = Broadcast.get({
    id: $routeParams.id
  }, function() {
    $scope.broadcast = broadcast;
  }, function() {
    Notification.error('您访问的页面不存在');
    $location.path('/broadcasts')
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

  $scope.isAdmin = function(){
    if($scope.user.userType == 3){
      return true;
    }
    return false;
  };

  $scope.deleteBroadcastComment = function(broadcastCommentsId){
    BroadcastComment.deleteBroadcastComment(broadcastCommentsId, function(response){
      Notification.success("你已成功删除评论");
          BroadcastComment.get($routeParams.id, function(response) {
          $scope.comments = response.reverse();
         });
    });
  }


  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

  $scope.bookBroadcast = function(broadcastId) {
    User.post_broadcast_collections(broadcastId, function() {
      Notification.success('成功添加到收藏');
      User.check_broadcast_collections($routeParams.id, function(response) {
        $scope.checked = response.length;
      });
    }, function(response) {
      Notification.error(response.message);
    });
  }

  if ($auth.isAuthenticated()) {
    User.check_broadcast_collections($routeParams.id, function(response) {
      $scope.checked = response.length;
    });

    User.get_broadcast_comments_liked(function(response) {
      $scope.liked_comments = response;
      // console.log(response);
    })
  }

  BroadcastComment.get($routeParams.id, function(response) {
    $scope.comments = response.reverse();
  });

  $scope.add_comment = function() {
    if (!$scope.comment_content) {
      Notification.error('评论不能为空');
      return;
    }
    BroadcastComment.post($routeParams.id, $scope.comment_content, function() {
      Notification.success('评论添加成功');
      delete $scope.comment_content;
      BroadcastComment.get($routeParams.id, function(response) {
        $scope.comments = response.reverse();
      });
    });
  }

  $scope.already_liked = function(broadcast_comment_id) {
    if (!$auth.isAuthenticated()) {
      return true;
    }
    for (var i = 0; i < $scope.liked_comments.length; i++) {
      if ($scope.liked_comments[i].broadcastCommentsId == broadcast_comment_id) {
        return true;
      }
    }
    return false;
  }

  $scope.like_comment = function(comment) {
    var broadcast_comment_id = comment.broadcastCommentsId;
    BroadcastComment.like(broadcast_comment_id, function() {
      comment.likeNum++;
      comment.liked = true;
    });
  }

}]);
