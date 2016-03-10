'use strict';

angular.module('authicationAngularApp')
  .factory('authToken', function ($window) {
    // Service logic
    // ...
    var storage = $window.localStorage;
    var cachedToken;


    // Public API here
    return {
      setToken: function(token) {
        cachedToken = token;
        storage.setItem('userToken', token);
      },
      getToken : function () {
        if (!cachedToken) {
          cachedToken = storage.getItem('userToken');
        }
        return cachedToken;
      },
      isAuthenticated: function () {
        return !!this.getToken();
      }
    };
  });
