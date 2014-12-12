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
	$scope.loading = false;	
	$scope.cacher = false;
	$scope.ac3 = false;
	$scope.csp = {};
	$scope.grilleHoraire;
	$scope.choixType = ["facile-1", "facile-2",
						"moyen-1","moyen-2",
						"difficile-4","difficile-10","difficile-11","difficile-12",
						"difficile-13","difficile-14","difficile-15","difficile-100"];
	$scope.algoChx = ["AC3"]
	
	$scope.tests = [{
						"nom":"csp_easy_2.json",
						"temps":"0m0.054s",
						"memoire":"N/A",
					},{
						"nom":"csp_moyen_1.json",
						"temps":"0m0.287s",
						"memoire":"32.92",
					},{	
						"nom":"csp_hard_10.json",
						"temps":"0m1.682s",
						"memoire":"13.38",
					},{	
						"nom":"csp_hard_11.json",
						"temps":"0m8.664s",
						"memoire":"17.75",
					},{	
						"nom":"csp_hard_12.json",
						"temps":"0m50.638s",
						"memoire":"26.45",
					},{	
						"nom":"csp_hard_13.json",
						"temps":"4m50.808s",
						"memoire":"44.68",
					},{	
						"nom":"csp_hard_14.json",
						"temps":"47m56.080s",
						"memoire":"48.83",
					},{	
						"nom":"csp_hard_15.json",
						"temps":"227m33.507s",
						"memoire":"48.91",
					},{	
						"nom":"csp_hard_100.json",
						"temps":"N/A",
						"memoire":"N/A",
					}];
					
	$scope.testsAc3 = [{
						"nom":"csp_easy_2.json",
						"temps":"0m0.057s",
						"memoire":"N/A",
					},{
						"nom":"csp_moyen_1.json",
						"temps":"0m0.522s",
						"memoire":"30.09",
					},{	
						"nom":"csp_hard_10.json",
						"temps":"0m0.059s",
						"memoire":"N/A",
					},{	
						"nom":"csp_hard_11.json",
						"temps":"0m0.059s",
						"memoire":"N/A",
					},{	
						"nom":"csp_hard_12.json",
						"temps":"0m0.055s",
						"memoire":"N/A",
					},{	
						"nom":"csp_hard_13.json",
						"temps":"0m0.061s",
						"memoire":"N/A",
					},{	
						"nom":"csp_hard_14.json",
						"temps":"0m0.061s",
						"memoire":"N/A",
					},{	
						"nom":"csp_hard_15.json",
						"temps":"0m0.063s",
						"memoire":"9.01",
					},{	
						"nom":"csp_hard_100.json",
						"temps":"0m6.635s",
						"memoire":"18.10",
					}];


	
	$scope.getInfo = function(coursId){
		for(var i = 0; i < $scope.cours.length; i++){
			if($scope.cours[i].id == coursId) {
				enlever($scope.cours[i]);
				return $scope.cours[i];
			};
		}
	}
	
	$scope.algorith = function(algoId, check){
		$scope.ac3 = check;
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
	
	$scope.getCSP = function(choix){
		if(choix){
			$scope.cspChoisi=true
			var param = choix;
			$http.get('/api/CSPs/'+ param).
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
		$scope.loading = true;
		$scope.csp["AC3"] = $scope.ac3;
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
					$scope.loading = false;				
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
