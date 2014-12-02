'use strict';

/* App Module */

var app = angular.module('app', [
  'ngRoute',
  'horaireControllers',
  'ui.bootstrap'
]);

app.config(['$routeProvider',
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
