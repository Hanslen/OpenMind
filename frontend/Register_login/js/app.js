var app = angular.module('account',['ngRoute']).
	config(function($routeProvider){
		$routeProvider
			.when('/personalDetail', {
				templateUrl: 'accountView/personalDetails.html',
				controller: function(){
					$(".socialContact").removeClass("todo-done");

					$(".personalDetail").addClass("todo-done");

					$(".passwordReset").removeClass("todo-done");

					$(".myTag").removeClass("todo-done");

					$(".balance").removeClass("todo-done");

				},
				controllerAs: "personalDetail"
			})
			.when('/socialContact',{
				templateUrl: 'accountView/socialContact.html',
				controller: function(){
					$(".socialContact").addClass("todo-done");

					$(".personalDetail").removeClass("todo-done");

					$(".passwordReset").removeClass("todo-done");

					$(".myTag").removeClass("todo-done");

					$(".balance").removeClass("todo-done");
				},
				controllerAs: "socialContact"
			})
			.when('/passwordReset',{
				templateUrl: 'accountView/passwordReset.html',
				controller: function(){
					$(".socialContact").removeClass("todo-done");

					$(".personalDetail").removeClass("todo-done");

					$(".passwordReset").addClass("todo-done");

					$(".myTag").removeClass("todo-done");

					$(".balance").removeClass("todo-done");
				},
				controllerAs: "passwordReset"
			})
			.when('/myTag',{
				templateUrl: 'accountView/myTag.html',
				controller: function(){
					$(".socialContact").removeClass("todo-done");

					$(".personalDetail").removeClass("todo-done");

					$(".passwordReset").removeClass("todo-done");

					$(".myTag").addClass("todo-done");

					$(".balance").removeClass("todo-done");

				},
				controllerAs: "myTag"
			})
			.when('/balance',{
				templateUrl: 'accountView/balance.html',
				controller: function(){
					$(".socialContact").removeClass("todo-done");

					$(".personalDetail").removeClass("todo-done");

					$(".passwordReset").removeClass("todo-done");

					$(".myTag").removeClass("todo-done");

					$(".balance").addClass("todo-done");
				},
				controllerAs: "balance"
			})
			.otherwise({
				redirectTo: '/personalDetail'
			});
	});
app.controller("TabController", function(){
	this.tab = 1;
	this.tabSet = function(value){
		this.tab = value;
	}
	this.showTab = function(value){
		return this.tab === value;
	}

});