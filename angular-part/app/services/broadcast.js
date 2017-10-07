angular.module('myApp').factory('Broadcast', function($resource) {
  return $resource('/content/broadcasts/:id'); // Note the full endpoint address
  // return $resource('http://55cff01954409c11000dbd40.mockapi.io/broadcasts/:id');
});
