'use strict';

/**
 * @ngdoc function
 * @name authicationAngularApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the authicationAngularApp
 */
angular.module('authicationAngularApp')
  .controller('RegisterCtrl', function ($scope, $http) {
    $scope.submit = function () {


      var url = '/';
      var user = {};

      $http.post(url, user)
        .success(function (res) {
          console.log('success');
        })
        .error(function (err) {
          console.log('error');
        });
    }
  });
