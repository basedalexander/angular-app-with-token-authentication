'use strict';

angular.module('authicationAngularApp')
  .controller('RegisterCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
    $scope.submit = function () {
      var url = 'http://localhost:3000/register';
      var user = {
        email: $scope.email,
        password: $scope.password
      };

      $http.post(url, user)
        .success(function (res) {
          alert('success', 'Account created', 'Welcome, ' + res.user.email + '!');
          authToken.setToken(res.token);
          $state.go('main');
        })
        .error(function (err) {
          alert('warning', 'Opps', 'Could not register');
        });
    };
  });
