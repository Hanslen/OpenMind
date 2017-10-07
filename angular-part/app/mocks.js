(function() {
  'use strict';
  /**
   * This module is used to simulate backend server for this demo application.
   */
  angular.module('content-mocks', ['ngMockE2E'])

  .run(function($httpBackend) {

    var authorized = false;

    // Login
    $httpBackend.whenPOST('/auth/login').respond(function(method, url, data) {
      data = JSON.parse(data);
      // fake email and password
      if (data['email'] != 'admin' || data['password'] != 'admin') {
        return [401, { message: 'Wrong email and/or password' }, {}];
      }
      authorized = true;
      var d = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      };
      var message = angular.fromJson(d);
      return [200, message, {}];
    });

    // Signup
    // $httpBackend.whenPOST('/auth/signup').respond(function(method, url, data) {
    //   data = JSON.parse(data);
    //   if (data.email == 'admin') {
    //     return [409, { message: 'Email is already taken' }, {}];
    //   }
    //   authorized = true;
    //   var d = {
    //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
    //   };
    //   var message = angular.fromJson(d);
    //   return [200, message, {}];
    // });
    // $httpBackend.whenPOST('auth/logout').respond(function(method, url, data) {
    //     authorized = false;
    //     return [200];
    // });


    // $httpBackend.whenPOST('data/public').respond(function(method, url, data) {
    //     return [200, 'I have received and processed your data [' + data + '].'];
    // });
    // $httpBackend.whenPOST('data/protected').respond(function(method, url, data) {
    //     return authorized ? [200, 'This is confidential [' + data + '].'] : [401];
    // });

    // //otherwise

    $httpBackend.whenGET(/.*/).passThrough();

  });
})();
