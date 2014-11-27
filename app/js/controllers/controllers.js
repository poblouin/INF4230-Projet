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
	
	$http.get('/api/lesCours').
	success(function(data, status, headers, config) {
		$scope.cours = data;
	}).
	error(function(data, status, headers, config) {
		console.log("ERREUR");
	});
	
	$scope.getInfo = function(cours){
		for(var i = 0; i < $scope.cours.length; i++){
			if($scope.cours[i].id == cours) return $scope.cours[i];
		}
	}
						
	$scope.generer = function(){
		$scope.genererBool=true;
		$http.get('/api/CSP').
		success(function(data, status, headers, config) {
			$scope.grilleHoraire = data;
		}).
		error(function(data, status, headers, config) {
			console.log("ERREUR");
		});
	}
	
  }]);
