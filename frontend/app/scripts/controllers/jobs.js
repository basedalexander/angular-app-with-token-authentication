'use strict';

angular.module('authicationAngularApp')
  .controller('JobsCtrl', function ($scope, $http, API_URL, alert) {

    $http.get(API_URL + 'jobs')
      .success(function (jobs) {
        $scope.jobs = jobs;
      })
      .error(function (err) {
        alert('warning', 'Unable to get jobs');
      });

    $scope.addJob = function () {
     $http.post(API_URL + 'jobs', {name: $scope.jobName, desc: $scope.jobDescription})
       .success(function (jobs) {
         $scope.jobName = '';
         $scope.jobDescription = '';
         $scope.jobs = jobs;
       })
       .error(function (err) {
         alert('warning', 'Unable to add the job', err.message);
       });
    };

    $scope.removeJob = function (name, desc) {

      console.log(name, desc);
      $http.put(API_URL + 'jobs', {name: name, desc: desc})
        .success(function (jobs){
          $scope.jobs = jobs;
        })
        .error(function (err) {
          alert('warning', 'unable to delete the job', err.message);
        });
    };

  });
