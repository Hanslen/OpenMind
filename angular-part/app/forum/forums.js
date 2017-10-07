'use strict';

angular.module('myApp.forums', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forums', {
    templateUrl: 'forum/forums.html',
    controller: 'forumsCtrl'
  });
}])

.controller('forumsCtrl', ['$scope', '$auth', 'Forum', 'User', 'Notification', 'Message','$location', function($scope, $auth, Forum, User, Notification, Message, $location) {
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

  var forums = Forum.query_all_forums(function(forum) {
    // console.log(forum);
    $scope.forums = forum;
  });


  // $scope.loadMore = function() {
  //   $scope.currentPage++;
  //   var broadcasts = $scope.broadcasts;
  //   var newItems = $scope.broadcasts.slice($scope.currentPage * $scope.itemsPerPage,
  //     $scope.currentPage * $scope.itemsPerPage + $scope.itemsPerPage);
  //   $scope.pagedItems = $scope.pagedItems.concat(newItems);
  // };

  $scope.nextPageDisabledClass = function() {
    return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.total / $scope.itemsPerPage);
  };

  $scope.add_forum = function(){
    console.log("no: "+(new Date()));
    console.log("db: "+ ($scope.user.time));
    if(Date.parse(new Date()) < Date.parse($scope.user.time)){
        alert("你被禁言了QAQ");
        return false;
    }
    if($scope.forum_header == undefined || $scope.forum_content == undefined){
      alert("请填写所有空白～");
      return false;
    }
    Forum.postForum($scope.forum_header, $scope.forum_content,function(){
        Forum.query_all_forums(function(forums){
          $scope.forums = forums;
        });
    });
  }

}]);
