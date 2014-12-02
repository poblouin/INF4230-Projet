var cspModule = require("./csp.js");

var csp = {};

//Retourne le cours ayant l'index pass� en param�tre dans le json r�cup�r�
exports.getProfesseur = function(req, res) {
	//Professeur
	var index = parseInt(req.params.id);
	
	if(index > JSON.parse(professeur).length - 1){
		res.send("L'id de professeur n'existe pas!");
	} else {
		var unProfesseur = JSON.parse(professeur)[index];
		res.send(unProfesseur);
	}
}

//Retourne la liste des professeurs
exports.getProfesseurs = function(req, res) {
	//Professeurs	
	res.send(professeur);
}

//Retourne la liste des cours
exports.getTousLesCours = function(req, res) {
	//cours	
	res.send(cours);
}

//Retourne le cours ayant l'index pass� en param�tre dans le json r�cup�r�
exports.getCours = function(req, res) {
	//Cours
	var index = parseInt(req.params.id);

	if(index > JSON.parse(professeur).length - 1){
		res.send("L'id du cours n'existe pas!");
	} else {
		var unCours = JSON.parse(cours)[index];
		res.send(unCours);
	}
}

//Modifie le CSP par l'interface
exports.postCSP = function(req, res) {
	csp = req.body.csp;
	console.log(csp);
	res.send(200);
}

//R�cup�re le module de csp et fait appel � la fonction search
//Retourne les json r�sultant du csp.
exports.getGenerer = function(req, res) {	
	var CSPjson = cspModule.search(csp);
	res.send(CSPjson);
}

//R�cup�re le module de csp et fait appel � la fonction search
//Retourne les json r�sultant du csp.
exports.getCSPIndex = function(req, res) {
	var index = req.params.index;
	
	var cours = JSON.stringify(require('./data/csp'+index+'/cours.json'));
	var professeur = JSON.stringify(require('./data/csp'+index+'/professeur.json'));
	
	csp.professeurs = JSON.parse(professeur);
	csp.coursDisponibles = JSON.parse(cours);
	res.send(csp);
}

