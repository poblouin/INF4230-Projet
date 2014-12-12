var cspModule = require("./csp.js");

var csp = {};

//Modifie le CSP par l'interface
exports.postCSP = function(req, res) {
	csp = req.body.csp;;
	res.sendStatus(200);
}

//Récupère le module de csp et fait appel à la fonction search
//Retourne les json résultant du csp.
exports.getGenerer = function(req, res) {	
	var ac3 = csp["AC3"] ? csp["AC3"] : false;
	var CSPjson = cspModule.search(csp, ac3);
	res.send(CSPjson);
}

//Récupère le module de csp et fait appel à la fonction search
//Retourne les json résultant du csp.
exports.getCSPIndex = function(req, res) {
	var choix = req.params.choix;
	var cspUrl = choix.split('-')
	
	console.log(cspUrl[0] + "," + cspUrl[1]);
	
	var cspString = JSON.stringify(require('./data/csp_'+cspUrl[0]+'/csp_'+cspUrl[0]+'_'+cspUrl[1]+'.json'));
	var csp = JSON.parse(cspString);
	res.send(csp);
}

