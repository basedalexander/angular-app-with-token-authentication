'use strict';

angular.module('authicationAngularApp')
  .controller('JobsCtrl', function ($scope) {
   $scope.jobs = [
     'front-end developer',
     'back-end developer',
     'senior c++ developer'
   ]
  });
