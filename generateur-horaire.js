var professeur = [
	//remplir les professeurs

];

var cours = [
	//remplir les cours

];

exports.genererListeProfesseur = function() {
	//Cr�er la liste des professeurs (Soit import d'un json ou d'une BD)
}

exports.genererListeCours = function() {
	//Cr�er la liste des cours (Soit import d'un json ou d'une BD)
}

exports.getCSP = function(req, res) {
	//On pourrait faire le traitement ici
	var CSPjson = null;
	CSPjson = {
		nom:"TEST"
	}
	res.send(CSPjson);
}

