'use strict';

angular.module('authicationAngularApp')
  .service('auth', function ($http, API_URL, authToken, $state, $window) {

    function authSuccessful (res) {
      authToken.setToken(res.token);
      $state.go('main');
    }

    this.login = function (email, password) {
      return $http
        .post(API_URL + 'login', { email: email, password: password})
        .success(authSuccessful);
    };

    this.register = function (email, password) {
      return $http
        .post(API_URL + 'register', { email: email, password: password})
        .success(authSuccessful);
    };

    var urlBuilder = [];
    var client_id = '882254101942-oo2cirj4ju5ogtjlhnqd8nc8at8nruar.apps.googleusercontent.com';

    urlBuilder.push(
      'response_type=code',
      'client_id=' + client_id,
      'redirect_uri=' + $window.location.origin,
      'scope=profile email');

    this.googleAuth = function () {
      var url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlBuilder.join('&');
      var options = 'width=500, height=500, left=' + ($window.outerWidth - 500)/2
      + ', to=' + ($window.outerHeight - 500)/2;

      var popup = $window.open(url, '', options);
      $window.focus();

      $window.addEventListener('message', function (event) {
        if (event.origin === $window.location.origin) {
          var code = event.data;
          popup.close();

          $http.post(API_URL + 'auth/google', {
            code: code,
            clientId: client_id,
            redirectUri : $window.location.origin
          })

        }
      });
    }

  });
