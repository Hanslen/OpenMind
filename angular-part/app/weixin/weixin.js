'use strict'
angular.module('myApp.weixin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/weixin', {
    templateUrl: 'weixin/weixin.html',
    controller: 'weixinCtrl'
  });
}])

.controller('weixinCtrl',['$scope','$auth','Peer','User','Notification', 'Message','$routeParams','$http',function($scope, $auth, Peer, User, Notification, Message,$routeParams,$http) {
  	var templateURL = document.URL;
  	var qs = templateURL.split("?");
  	var qcode = qs[1].split("#")[0].split("=")[1].split('&')[0];

  	var code = qcode;
  	$scope.isAuthenticated = function() {
		return $auth.isAuthenticated();
	};
    // document.write(code);

 //    var nodegrass = require('nodegrass');
	// nodegrass.get("/#/signup",function(data,status,headers){ 
	// 	  console.log(status); 
	// 	  console.log(headers); 
	// 	  console.log(data); 
	// 	},'utf8').on('error', function(e) {
	// 	  console.log("Got error: " + e.message); 
	// });
    var AppId = "wxa4aedc705b3fc018";
    var AppSecret = "dcf98be8210b46ab773882b22409fcd8";
    var openidUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppId
        + '&secret=' + AppSecret
        + '&code='+code
        + '&grant_type=authorization_code';
       // document.write(openidUrl); 
    User.weixin(code, function(){
    	document.write("heihei");
    });
    // nodegrass.get(openidUrl,function(data,status,headers){

    //     var access_token_info = JSON.parse(data);
    //     var access_token = access_token_info.access_token;
    //     var openid = access_token_info.openid;
    //     var getUserInfo = 'https://api.weixin.qq.com/sns/userinfo?access_token='
    //         + access_token + '&openid=' + openid + '&lang=zh_CN';
    //     nodegrass.get(getUserInfo,function(data,status,headers){
    //         console.log(data);
    //         res.render('userinfo', JSON.parse(data));
    //         $scope.data1 = "wow";
    //         $scope.data2 = userinfo;
    //     },'utf8').on('error', function(e) {
    //         console.log("Got error: " + e.message);
    //     });

    // },'utf8').on('error', function(e) {
    //     console.log("Got error: " + e.message);
    // });
}]);