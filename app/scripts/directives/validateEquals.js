'use strict';

/**
 * @ngdoc directive
 * @name authicationAngularApp.directive:sameAs
 * @description
 * # sameAs
 */

angular.module('authicationAngularApp')
  .directive('validateEquals', function () {

    var linker = function (scope, element, attrs, ngModelCtrl) {

      // console.log(scope);
      function validateEqual (value) {
       var valid = (value === scope.$eval(attrs.validateEquals));

       ngModelCtrl.$setValidity('equal', valid );

       return valid ? value : undefined;
      }

      // Course stopped at video n14, 4:41

      // Adding new parser and filter
      // https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
      ngModelCtrl.$parsers.push(validateEqual);
      ngModelCtrl.$formatters.push(validateEqual);

      // Listening to event on form element
      // https://docs.angularjs.org/api/ng/type/$rootScope.Scope
      scope.$watch(attrs.validateEquals, function () {
        // console.log(attrs.validateEquals);
        // console.log(ngModelCtrl);
        ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
      });
    };

    return {
      require: 'ngModel',
      link: linker
    };
  });

