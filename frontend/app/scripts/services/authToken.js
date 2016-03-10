'use strict';

angular.module('authicationAngularApp')
  .factory('authToken', function ($window) {
    // Service logic
    // ...
    var storage = $window.localStorage;
    var cachedToken;
    var userToken = 'userToken';


    // Public API here
    var authToken =  {
      setToken: function(token) {
        cachedToken = token;
        storage.setItem(userToken, token);
      },
      getToken : function () {
        if (!cachedToken) {
          cachedToken = storage.getItem(userToken);
        }
        return cachedToken;
      },
      removeToken: function () {
        cachedToken = null;
        storage.removeItem(userToken);
      },
      isAuthenticated: function () {
        return !!authToken.getToken();
      }
    };

    return authToken;
  });
