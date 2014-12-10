'use strict';

/* Controllers */

var horaireControllers = angular.module('horaireControllers', []);

horaireControllers.controller('GenerationHorairesCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.professeurs = [];
	$scope.cours = [];
	$scope.nombreCoursADistribue = 0;
	$scope.coursNonAttribues = [];
	$scope.cspChoisi = false;
	$scope.cacher = false;
	$scope.csp = {};
	$scope.grilleHoraire;
	$scope.choixCsp = [1,2,3,4];
	$scope.algoChx = ["backtrackingSearch", "Hill climbing", "AC3"]
	
	$scope.getInfo = function(coursId){
		for(var i = 0; i < $scope.cours.length; i++){
			if($scope.cours[i].id == coursId) {
				enlever($scope.cours[i]);
				return $scope.cours[i];
			};
		}
	}
	
	$scope.algorith = function(algoId, check){
		$scope.csp[algoId] = check;
	}
	
	var enlever = function(coursEnleve) {
		$scope.coursNonAttribues.forEach(function(cours, i){
			if(cours.id == coursEnleve.id) {
				$scope.coursNonAttribues.splice(i,1);
				return;
			};
		});
	}
	
	$scope.nombreCoursADistribuer = function(){
		var coursADistribuer = 0;
		$scope.professeurs.forEach(function(professeur){
			coursADistribuer = coursADistribuer + professeur.nombreCoursDesires;
		});
		$scope.nombreCoursADistribue = coursADistribuer;
	}
	
	$scope.getCSP = function(index){
		if(index){
			$scope.cspChoisi=true
			$http.get('/api/CSPs/' + parseInt(index)).
			success(function(data, status, headers, config) {
				$scope.genererBool=false;			
				$scope.csp = data;
				$scope.professeurs = data.professeurs;
				$scope.nombreCoursADistribuer();
				$scope.cours = data.coursDisponibles;
				$scope.coursNonAttribues = angular.copy(data.coursDisponibles);
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
			//params: {csp: $scope.grilleHoraire},
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
