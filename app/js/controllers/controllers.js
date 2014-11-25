'use strict';

/* Controllers */

var horaireControllers = angular.module('horaireControllers', []);

horaireControllers.controller('GenerationHorairesCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.professeurs = [];
	$scope.grilleHoraire = [];
	
	$http.get('/api/professeurs').
	success(function(data, status, headers, config) {
		$scope.professeurs = data;
	}).
	error(function(data, status, headers, config) {
		console.log("ERREUR");
	});
						
	$scope.generer = function(){
		$http.get('/api/CSP').
		success(function(data, status, headers, config) {
			$scope.grilleHoraire = data;
		}).
		error(function(data, status, headers, config) {
			console.log("ERREUR");
		});
	}
	
  }]);
