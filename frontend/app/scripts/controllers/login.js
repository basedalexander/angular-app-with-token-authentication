'use strict';

angular.module('authicationAngularApp')
  .controller('LoginCtrl', function ($scope, alert, auth) {
    $scope.submit = function () {

      auth.login($scope.email, $scope.password)
        .success(greetUser)
        .error(handleError);
    };

    $scope.google = function () {
      auth.googleAuth().then(greetUser, handleError);
    };

    $scope.vk = function () {
      auth.vkAuth().then(greetUser, handleError);
    };

    function handleError (err) {
      alert('warning', 'Something went wrong :( ', err.message);
    }

    function greetUser (res) {
      alert('success', 'Welcome', 'Thanks for coming back ' + (res.user.email || res.user.displayName) + '!');
    }
  });
