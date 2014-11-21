'use strict';

/* Controllers */

var horaireControllers = angular.module('horaireControllers', []);

horaireControllers.controller('GenerationHorairesCtrl', ['$scope',
  function($scope) {
    $scope.professeurs = 	[	{	
								nom:'Beaudry',
								prenom:'Eric',
								cours:[],
								coursDesires: ['INF4204'],
								mauvaiseEvaluation:['INF9999']
							}
						];
						
	var cours = 	{	
						sigle : 'INF4230',
						session:'A2014',
						groupe: 10,
						jour: 0,
						heure : 1
					};
					
	var cours2 =	{	
						sigle : 'INF4730',
						session:'A2014',
						groupe: 20,
						jour: 0,
						heure : 1
					};
				
	$scope.professeurs[0].cours.push(cours);
	$scope.professeurs[0].cours.push(cours2);
	
  }]);
