'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngResource',
  'satellizer',
  'mgcrea.ngStrap',
  'ngFileUpload',
  'filters',
  'ui-notification',
  // 'ui.bootstrap',
  // 'content-mocks',
  'angular-loading-bar',
  'ui.bootstrap.datetimepicker',
  'myApp.index',
  'myApp.login',
  'myApp.signup',
  'myApp.broadcasts',
  'myApp.broadcast',
  'myApp.discussions',
  'myApp.discussion',
  'myApp.peers',
  'myApp.peer',
  'myApp.account',
  'myApp.dashboard_broadcast',
  'myApp.dashboard_topic',
  'myApp.dashboard_discussion',
  'myApp.dashboard_message',
  'myApp.dashboard_appointments',
  'myApp.user_profile',
  'myApp.search',
  'myApp.appointment',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.application',

  'myApp.admin',

  'myApp.forums',
  'myApp.forum',
  'myApp.weixin'

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    redirectTo: '/dashboard/account'
  });
  $routeProvider.otherwise({redirectTo: '/'});
}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 50;
}]);
