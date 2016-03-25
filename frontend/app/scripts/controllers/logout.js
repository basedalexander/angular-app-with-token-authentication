'use strict';

angular.module('authicationAngularApp')
  .controller('LogoutCtrl', function ($state, $auth) {
    $auth.logout();
    $state.go('main');
  });
