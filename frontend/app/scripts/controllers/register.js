'use strict';

angular.module('authicationAngularApp')
  .controller('RegisterCtrl', function ($scope, alert, $auth) {
    $scope.submit = function () {
      $auth.signup({
        email: $scope.email,
        password: $scope.password
      })
        .then(function (res) {
          alert('success', 'Account created', 'Welcome, ' + res.data.user.email + '!' + ' Please email activate your account in the next several days');
        })
        .catch(function (err) {
          alert('warning', 'Something went wrong :(', err.message);
        });
    }
  });
