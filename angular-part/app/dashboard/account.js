'use strict';

angular.module('myApp.account', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/account', {
    templateUrl: 'dashboard/account.html',
    controller: 'accountCtrl',
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

.controller('accountCtrl', ['$scope', '$auth', 'User', 'Notification', '$window', 'Upload', '$timeout', '$route', 'Message', function($scope, $auth, User, Notification, $window, Upload, $timeout, $route, Message) {
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
    var name = "";
    var user = User.get(function(user) {
      $scope.user = user;
      $scope.update_detail = {};
      $scope.update_detail.briefInto = user.briefInto;
      $scope.update_detail.school = user.school;
      $scope.update_detail.city = user.city;
      $scope.update_detail.age = user.age;
      console.log(user.gender.data[0]);
      if(user.gender.data[0] == 0){
        name = '男';
      }
      else if(user.gender.data[0] == 1){
        name = '女';
      }
      $scope.update_detail.gender = {
      availableOptions: [
        {id: '0', name: '男'},
        {id: '1', name: '女'}
      ],
      selectedOption: {id: user.gender.data[0], name: name} //This sets the default value of the select in the ui
      };

      // $scope.update_detail.gender = user.gender;
        // console.log("wow");
      $scope.update_detail.skype = user.skype;
    });

    Message.query_unviewed_messages(function(response) {
      $scope.messages = response;
    });
  }

  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

  $scope.update_username = function() {
    if (!$scope.username) {
      $scope.error_message = "请填写新用户名";
      return;
    }

    User.update_username($scope.username, function() {
      Notification.success('您已成功更改用户名');
      angular.element('#username_close').trigger('click');
    });
    if ($auth.isAuthenticated()) {
      var user = User.get(function(user) {
        $scope.user = user;
      });
    }
  }

  $scope.update_password_func = function() {
    if (!$scope.update_password || !$scope.update_password.password || !$scope.update_password.new_password || !$scope.password_again) {
      $scope.error_message_password = "请填写全表单";
      return;
    }
    if ($scope.update_password.new_password != $scope.password_again) {
      $scope.error_message_password = "两次输入的密码不同";
      return;
    }
    User.update_password($scope.update_password, function() {
      // success
      Notification.success('您已成功更改密码');
      angular.element('#password_close').trigger('click');
      if ($auth.isAuthenticated()) {
        var user = User.get(function(user) {
          $scope.user = user;
        });
      }
    }, function(response) {
      // faillure
      $scope.error_message_password = response.data.message;
    });
  }
  
//pai's update
  $scope.update_userdetail_func = function(){
    // console.log("intoupdate");
    User.update_Detail($scope.update_detail, function(){
      Notification.success('您已成功更新了信息');
      if($auth.isAuthenticated()){
        var user = User.get(function(user){
          $scope.user = user;
        });
      }
    });
  }
//pai ends

  $scope.uploadFiles = function(file) {
    $scope.f = file;
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: '/api/upload_avatar',
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          file.result = response.data;
        });
        if ($auth.isAuthenticated()) {
          var user = User.get(function(user) {
            $scope.user = user;
          });
        }
        // success
        Notification.success('您已成功修改头像');
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });

      file.upload.progress(function(evt) {
        file.progress = Math.min(100, parseInt(100.0 *
          evt.loaded / evt.total));
      });
    }
  }
}]);
