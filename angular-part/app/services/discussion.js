angular.module('myApp').factory('Discussion', function($resource) {
  return $resource('/content/discussions/:id'); // Note the full endpoint address
});
