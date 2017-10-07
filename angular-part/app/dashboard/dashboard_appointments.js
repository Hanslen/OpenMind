'use strict';

angular.module('myApp.dashboard_appointments', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/dashboard/appointments', {
    templateUrl: 'dashboard/dashboard_appointments.html',
    controller: 'dashboardAppointmentsCtrl',
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

.controller('dashboardAppointmentsCtrl', ['$scope', '$auth', 'User', 'Notification', '$route', 'Message', function($scope, $auth, User, Notification, $route, Message) {
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

    //pai code
    User.get_appointment_collections(function(appointments){
      $scope.appointment = appointments;
    });
    
  }

  $scope.viewMessage = function(message) {
    Message.view_message(message.messageId, function() {
    });
  }

  User.query_appointments(function(response) {
    $scope.appointments = response;
    
  })
}]);
