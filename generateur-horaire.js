//require("./csp/");

var professeur = require('./data/professeur.json');
var cours = require('./data/cours.json');

exports.genererListeCours = function() {
	//Créer la liste des cours (Soit import d'un json ou d'une BD)
}

exports.getProfesseur = function(req, res) {
	//Professeur
	var index = parseInt(req.params.id);
	var unProfesseur = professeur[index];
	
	res.send(unProfesseur.nom);

}

exports.getCours = function(req, res) {
	//Cours
	var index = parseInt(req.params.id);
	var unCours = cours[index];
	
	res.send(unCours.sigle);
}

exports.getCSP = function(req, res) {
	//On pourrait faire le traitement ici
	var CSPjson = null;
	CSPjson = {
		nom:"TEST"
	}
	
	res.send(CSPjson);
}

