'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index/index.html',
    controller: 'indexCtrl'
  });
}])

.controller('indexCtrl', ['$scope', '$auth', 'User', 'Notification', 'Message', function($scope, $auth, User, Notification, Message) {
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
  //show tobepeer or not
  	var canApply = false;
    var isApplying = false;
	if ($scope.isAuthenticated()){
		var user = User.get(function(user) {
			if(user.userType==0 ||user.userType == 1){
				canApply = true;
			} 
      if(user.userType == 1){
        isApplying = true;
      }
		});
	};
	$scope.checkCanApply = function(){	
		return canApply;
	}
  $scope.checkIsApplying = function(){
    return isApplying;
  }
  //show admin controller or not
	var isAdmin = false;
	if ($scope.isAuthenticated()){
		var user = User.get(function(user){
			if (user.userType == 3){
				isAdmin = true;
			}
		});
	}
	
	$scope.checkIsAdmin = function(){
		return isAdmin;
	}

}]);
