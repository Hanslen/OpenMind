'use strict';

angular.module('myApp.application', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/application', {
    templateUrl: 'application/application.html',
    controller: 'applicationCtrl'
  });
}])

.controller('applicationCtrl',['$scope','$auth','Peer','User','Notification', 'Message',function($scope, $auth, Peer, User, Notification, Message) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
  
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
	// if ($scope.isAuthenticated()){
		// var user = User.get(function(user) {
			// if(user.userType!=3 || user.userType != 2){
				// canApply = true;
			// } 
      // if(user.userType == 1){
        // isApplying = true;
      // }
		// });
	// };
	$scope.checkCanApply = function(){	
		return canApply;
	}
  $scope.checkIsApplying = function(){
    return isApplying;
  }
	
    if ($auth.isAuthenticated()) {
    var user = User.get(function(user) {
      $scope.user = user;
    });

    var applying = User.getPeerApplying(function(user){
      $scope.application = user;
      console.log(user);
    });

    Message.query_unviewed_messages(function(response) {
      $scope.messages = response;
    });
  }
	// $scope.update_func = function(){
    // User.update_peer($scope.application, function(){
      // Notification.success('您已成功向我们更新申请');
      // if($auth.isAuthenticated()){
        // var user = User.get(function(user){
          // $scope.user = user;
        // });
      // }
    // });
	// }
	
  //pai's update
  $scope.apply_func = function(){
    
    // console.log("intoupdate");
	$scope.application.userid = $scope.user.userId;
    User.apply_peer($scope.application, function(){
      Notification.success('您已成功向我们提交申请');
      if($auth.isAuthenticated()){
        var user = User.get(function(user){
          $scope.user = user;
        });
      }
    });
  }
//pai ends

  }]);