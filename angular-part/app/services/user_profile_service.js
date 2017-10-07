angular.module('myApp').factory('UserProfile', function($resource) {
  return $resource('/content/users/:id'); // Note the full endpoint address
});
