'use strict';

angular.module('myApp.peer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/peers/:id', {
    templateUrl: 'peer/peer.html',
    controller: 'peerCtrl'
  });
}])

.controller('peerCtrl', ['$scope', '$routeParams', '$auth', 'User', 'Peer', '$location', 'Notification', 'Message', 'Topic', '$route',function($scope, $routeParams, $auth, User, Peer, $location, Notification, Message, Topic, $route) {

  var peer = Peer.get({id: $routeParams.id}, function() {
    $scope.peer = peer;
  }, function() {
    Notification.error('您访问的页面不存在');
    $location.path('/peers');
  })

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
  //pai code
  $scope.bookPeer = function(peerId){
    // console.log("click work");
    User.book_peer_collection(peerId, function(){
      Notification.success('成功添加到收藏');
      User.check_topic_collections($routeParams.id, function(response){
        ($scope.checked.likeTopic).push({"topicId": peerId});
        console.log("length~~:"+$scope.checked.likeTopic.length);
      });
    }, function(response){
      Notification.error(response.message);
    });
  }
  $scope.cancelPeer = function(topicId, topic){
    User.delete_topic_collections(topicId, function() {
      // success
      Notification.success('您已成功取消收藏该话题');
      User.check_topic_collections($routeParams.id, function(response){
        // delete ($scope.checked.likeTopic)[0].topicId;
        // ($scope.checked.likeTopic).splice({"topicId": topicId}, 1);
        $route.reload();
        console.log("length~~:"+$scope.checked.likeTopic.length);
      });
    });
  }

  if($auth.isAuthenticated()){
    User.check_topic_collections($routeParams.id, function(response){
      $scope.checked = response;
      console.log($scope.checked.likeTopic[0].topicId);

    });
  }
  $scope.checkShow = function(value){
    for(var i = 0; i < $scope.checked.likeTopic.length; i++){
      // console.log("run time: "+i);
      // console.log("value: "+value);
      if($scope.checked.likeTopic[i].topicId == value){
        return true;
      }
    }
    return false;
  };
  //pai end

  Topic.query($routeParams.id, function(response) {
    $scope.topics = response;
  }, function() {
    Notification.error('您访问的页面不存在');
    $location.path('/peers');
  })
}]);
