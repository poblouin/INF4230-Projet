var cspModule = require("./csp.js");

var professeur = JSON.stringify(require('./data/professeur.json'));
var cours = JSON.stringify(require('./data/cours.json'));

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

//R�cup�re le module de csp et fait appel � la fonction search
//Retourne les json r�sultant du csp.
exports.getCSP = function(req, res) {
	var csp = {};
	
	//Pour ne pas que l'objet soit en r�f�rence on le stringify et
	//ensuite on le parse en objet.
	csp.professeurs = JSON.parse(professeur);
	csp.coursDisponibles = JSON.parse(cours);
	
	var CSPjson = cspModule.search(csp);
	res.send(CSPjson);
}

