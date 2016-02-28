'use strict';

/**
 * @ngdoc overview
 * @name authicationAngularApp
 * @description
 * # authicationAngularApp
 *
 * Main module of the application.
 */
angular
  .module('authicationAngularApp', ['ui.router'])
  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html'
      })
  });
