'use strict';

angular.module('myApp.discussion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/discussions/:id', {
    templateUrl: 'discussion/discussion.html',
    controller: 'discussionCtrl'
  });
}])

.controller('discussionCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Discussion', '$location', 'Notification', 'DiscussionComment', 'Message', '$window', function($scope, $routeParams, $auth, User, Discussion, $location, Notification, DiscussionComment, Message, $window) {

  var discussion = Discussion.get({
    id: $routeParams.id
  }, function() {
    $scope.discussion = discussion;
  }, function() {
    Notification.error('您访问的页面不存在');
    $location.path('/discussions')
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

  $scope.isAdmin = function(){
    if($scope.user.userType == 3){
      return true;
    }
    return false;
  };

  $scope.deleteDiscussionComment = function(discussionCommentId){
    //console.log("wow:"+discussionCommentId);
      Notification.success("你已成功删除评论");
      DiscussionComment.deleteDiscussionComment(discussionCommentId, function(response){
          DiscussionComment.get($routeParams.id, function(response) {
            $scope.comments = response.reverse();
          });
      });
  };

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

  if ($auth.isAuthenticated()) {
    User.check_discussion_collections($routeParams.id, function(response) {
      $scope.checked = response.length;
    });

    User.get_discussion_comments_liked(function(response) {
      $scope.liked_comments = response;
    });

    User.check_application($routeParams.id, function(response) {
      $scope.already_applied = response.length;
    });
  }

  $scope.bookDiscussion = function(discussionId) {
    User.post_discussion_collections(discussionId, function() {
      Notification.success('成功添加到收藏');
      User.check_discussion_collections($routeParams.id, function(response) {
        $scope.checked = response.length;
      });
    }, function(response) {
      Notification.error(response.message);
    });
  }

  DiscussionComment.get($routeParams.id, function(response) {
    $scope.comments = response.reverse();
  });

  $scope.add_comment = function() {
    if (!$scope.comment_content) {
      Notification.error('评论不能为空');
      return;
    }
    DiscussionComment.post($routeParams.id, $scope.comment_content, function() {
      Notification.success('评论添加成功');
      delete $scope.comment_content;
      DiscussionComment.get($routeParams.id, function(response) {
        $scope.comments = response.reverse();
      });
    });
  }

  $scope.already_liked = function(discussion_comment_id) {
    if (!$auth.isAuthenticated()) {
      return true;
    }
    for (var i = 0; i < $scope.liked_comments.length; i++) {
      if ($scope.liked_comments[i].discussionCommentId == discussion_comment_id) {
        return true;
      }
    }
    return false;
  }

  $scope.like_comment = function(comment) {
    var discussion_comment_id = comment.discussionCommentId;
    DiscussionComment.like(discussion_comment_id, function() {
      comment.likeNum++;
      comment.liked = true;
    });
  }

  $scope.apply = function(discussionId) {
    User.apply_discussion(discussionId, function() {
      Notification.success("报名成功");
      // angular.element('#apply_close').trigger('click');
      $window.location.reload();
    }, function(message) {
      Notification.error(message);
    });
  }

}]);
