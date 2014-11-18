'use strict';

/* Controllers */

var horaireControllers = angular.module('horaireControllers', []);

horaireControllers.controller('GenerationHorairesCtrl', ['$scope',
  function($scope, $) {
    $scope.professeurs = 	[	{	
								nom:'Beaudry',
								prenom:'Eric',
								cours:['INF3105','INF4230','DIC9315']
							}
						];
  }]);
