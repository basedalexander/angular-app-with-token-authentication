'use strict';

/**
 * @ngdoc service
 * @name authicationAngularApp.alert
 * @description
 * # alert
 * Service in the authicationAngularApp.
 */
angular.module('authicationAngularApp')
  .service('alert', function ($rootScope, $timeout) {
    var alertTimeout;

    return function (type, title, message, timeout) {
      $rootScope.alert = {
        hasBeenShown: true,
        show: true,
        type: type,
        title: title,
        message: message
      };

      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function () {
        $rootScope.alert.show = false;
      }, timeout || 2000);
    };
  });
