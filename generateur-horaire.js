var cspModule = require("./csp.js");

var csp = {};

//Modifie le CSP par l'interface
exports.postCSP = function(req, res) {
	csp = req.body.csp;
	console.log(csp);
	res.sendStatus(200);
}

//Récupère le module de csp et fait appel à la fonction search
//Retourne les json résultant du csp.
exports.getGenerer = function(req, res) {	
	var CSPjson = cspModule.search(csp);
	res.send(CSPjson);
}

//Récupère le module de csp et fait appel à la fonction search
//Retourne les json résultant du csp.
exports.getCSPIndex = function(req, res) {
	var index = req.params.index;
	
	var cours = JSON.stringify(require('./data/csp'+index+'/cours.json'));
	var professeur = JSON.stringify(require('./data/csp'+index+'/professeur.json'));
	
	csp.professeurs = JSON.parse(professeur);
	csp.coursDisponibles = JSON.parse(cours);
	res.send(csp);
}

