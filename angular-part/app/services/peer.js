angular.module('myApp').factory('Peer', function($resource) {
  return $resource('/content/peers/:id'); // Note the full endpoint address
});
