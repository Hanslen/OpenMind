'use strict';

angular.module('myApp.forum', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forums/:id', {
    templateUrl: 'forum/forum.html',
    controller: 'forumCtrl'
  });
}])

.controller('forumCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Forum', '$location', 'Notification', 'BroadcastComment', 'Message', function($scope, $routeParams, $auth, User, Forum, $location, Notification, BroadcastComment, Message) {
  // console.log($routeParams.id);
  var forum = Forum.query_one_forums($routeParams.id, function(response){
    $scope.forum = response[0];
    // console.log($scope.forum);
  });  
  Forum.get_forum_comments_liked(function(response){
    $scope.liked_comments = response;
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

  $scope.isAdmin = function(){
    if($scope.user.userType == 3){
      return true;
    }
    return false;
  };

  $scope.deleteForumComment = function(forumCommentId){
    Forum.deleteForumComment(forumCommentId, function(response){
      Notification.success("你已成功删除评论");
      Forum.get_comments($routeParams.id, function(response) {
        $scope.comments = response;
      });
    });
  }

  $scope.deleteForumCommentinComment = function(incommentId){
    Forum.deleteForumCommentinComment(incommentId, function(response){
      Notification.success("你已成功删除评论");
        Forum.get_comments($routeParams.id, function(response) {
        $scope.incomments = response;
      });
    });
  }

  // BroadcastComment.get($routeParams.id, function(response) {
  //   $scope.comments = response;
  // });

  Forum.get_comments($routeParams.id, function(response){
    $scope.comments = response;
  });

  Forum.getAllinComments(function(response) {
        $scope.incomments = response;
        //console.log(response);
  });
  $scope.checkSame = function(incommentId, commentId){
    if(incommentId == commentId){
      return true;
    }
    return false;
  }

  $scope.add_comment = function() {
    if (!$scope.comment_content) {
      Notification.error('评论不能为空');
      return;
    }
    Forum.post($routeParams.id, $scope.comment_content, function() {
      Notification.success('评论添加成功');
      delete $scope.comment_content;
      Forum.get_comments($routeParams.id, function(response) {
        $scope.comments = response;
      });
    });
  }

    $scope.add_commentincomment = function(commentId) {
    if (!$scope.commentincomment_content) {
      Notification.error('评论不能为空');
      return;
    }
    Forum.postincomments($routeParams.id, commentId, $scope.commentincomment_content, function() {
      Notification.success('评论添加成功');
      delete $scope.commentincomment_content;
      Forum.get_incomments(commentId, function(response) {
        $scope.incomments = response;
      });
    });
  }

  $scope.already_liked = function(forum_comment_id) {
    if (!$auth.isAuthenticated()) {
      return true;
    }
    for (var i = 0; i < $scope.liked_comments.length; i++) {
      if ($scope.liked_comments[i].forumCommentId == forum_comment_id) {
        return true;
      }
    }
    return false;
  }

  $scope.like_comment = function(comment) {
    var forum_comment_id = comment.forumCommentId;
    Forum.like(forum_comment_id, function() {
      comment.likeNum++;
      comment.liked = true;
    });
  }

}]);
