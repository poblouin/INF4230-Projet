'use strict';

/* Controllers */

var horaireControllers = angular.module('horaireControllers', []);

horaireControllers.controller('GenerationHorairesCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.professeurs = [];
	$scope.cspChoisi = false;
	$scope.csp = {};
	$scope.grilleHoraire;
	$scope.choixCsp = [1];
	
	$scope.getInfo = function(cours){
		for(var i = 0; i < $scope.cours.length; i++){
			if($scope.cours[i].id == cours) return $scope.cours[i];
		}
	}
	
	$scope.getCSP = function(index){
		if(index){
			$scope.cspChoisi=true
			$http.get('/api/CSPs/' + parseInt(index)).
			success(function(data, status, headers, config) {	
				$scope.csp = data;
				$scope.professeurs = data.professeurs;
				$scope.cours = data.coursDisponibles;
			}).
			error(function(data, status, headers, config) {
				console.log("ERREUR");
			});
		}
	}
						
	$scope.generer = function(){
		$http
		({	
			method: 'post',
			url:'/api/createCSP',
			params: {csp: $scope.grilleHoraire},
			data: {
                        csp: $scope.csp
                    }
		}).
		success(function(data, status, headers, config) {
				$http.get('/api/CSP').
				success(function(data, status, headers, config) {	
					$scope.genererBool=true;
					$scope.grilleHoraire = data;
				}).
				error(function(data, status, headers, config) {
					console.log("ERREUR");
				});
		}).
		error(function(data, status, headers, config) {
			console.log("ERREUR");
		});
	}
	
  }]);
