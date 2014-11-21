'use strict';

/* App Module */

var phonecatApp = angular.module('app', [
  'ngRoute',
  'horaireControllers'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/index.html',
        controller: 'GenerationHorairesCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
