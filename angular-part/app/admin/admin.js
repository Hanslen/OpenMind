'use strict'

angular.module('myApp.admin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'admin/admin.html',
    controller: 'adminCtrl'
  });
}])

.controller('adminCtrl',['$scope','$auth','Peer','User','Notification', 'Message',function($scope, $auth, Peer, User, Notification, Message) {
	User.getAllUser(function(alluser){
		$scope.alluser = alluser;
	});

	$scope.jinyan = function(userId, jinyantime){
		var temp = Date.parse(new Date());
		var finaltime = new Date(temp + jinyantime);
		// alert(finaltime);
		//alert(userId);
		User.jinyan(userId, finaltime, function(){
			Notification.success('禁言成功');
		});
	}

	$scope.isAuthenticated = function() {
		return $auth.isAuthenticated();
	};

	$scope.sendOne = function(){
		User.send_one($scope.messageO,function(){
			Notification.success('发送成功');
			
		});
	}
	
	$scope.sendAll = function(){
		socket.emit("messages", $scope.messageA);
		User.send_all($scope.messageA,function(){
			Notification.success('发送成功');
			});
	}
	// $scope.sendOne = function(){
		// $http.post('/sendOne', {"person":$scope.person, "message":$scope.message}).then(function(response){
			// console.log("Send to a person a message");
		// }).catch(function(response){
			// console.log("Send failed");
			// $scope.error_message = response.data.message;
		// });
	// }
	// $scope.sendAll = function(){
		// $http.post('/sendAll', {"message":$scope.messageA}).then(function(response){
			// console.log("success send to all");
		// }).catch(function(response){
			// console.log("Send to all failed.");
			// $scope.error_message = response.data.message;
		// });
	// }
	$scope.approve = function(application) {
		User.approve_apply(application,function(){
			Notification.success('你已经批准' + application.userID + '的申请' );
		});
	}
	
	$scope.reject = function(application) {

		User.reject_apply(application,function(){
			Notification.success('你已经驳回' + application.userID + '的申请')
		
		});
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
	
	User.query_all_applications(function(response){
		$scope.all_applications = response;
	});
	
  }
  
  
}]);