'use strict';

angular.module('authicationAngularApp')
  .controller('RegisterCtrl', function ($scope, alert, $auth) {
    $scope.submit = function () {
      $auth.signup({
        email: $scope.email,
        password: $scope.password
      })
        .then(function (res) {
          alert('success', 'Account created', 'Welcome, ' + res.data.user.email + '!');
        })
        .catch(function (err) {
          alert('warning', 'Something went wrong :(', err.message);
        });
    }
  });

// {"user":{"__v":0,"email":"jerk401@gmail.com","_id":"56f552a59c303cfd1a176632","jobs":[]},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NmY1NTJhNTljMzAzY2ZkMWExNzY2MzIiLCJleHAiOjE0NTk3ODIwNTN9.QuiWAoQnMzFSY02rDtNATX_1qtEkiJgWWwQWx4cBGuU"}
// {"user":{"_id":"56f552a59c303cfd1a176632","email":"jerk401@gmail.com","__v":0,"jobs":[]},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NmY1NTJhNTljMzAzY2ZkMWExNzY2MzIiLCJleHAiOjE0NTk3ODI4MzZ9.KiyFslUcgS3Vzq2hJNz_s29prbV7ixxHPG8y21udtDQ"}
