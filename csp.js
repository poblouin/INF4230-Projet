// Hypothèses :
//
// - Afin de simplifier l'implémentation initiale de l'algorithme, on utilise une seule contrainte
//   pour débuter: deux cours ne peuvent pas être donnés par le même professeur. Ça va ressembler
//   drôlement au problème de 'coloriage' des provinces d'Australie.
//
// - Pour l'instant, chaque professeur va être assigné à un seul cours. Éventuellement, il faudrait
//   généraliser le problème et permettre à un professeur d'avoir N cours, où N est un nombre qu'il
//   va choisir. En gros, le professeur aurait le droit de donner entre 1 et N cours. Cette valeur
//   sera une propriété de l'objet professeur.
//
// - Dans l'objet 'csp', l'ordre de la liste des professeurs est significative. Le professeur en
//   position 0 va avoir ses cours avant celui à la position 1. Éventuellement, on pourrait utiliser
//   un ordre qui place les directeurs en premier, suivis des coordonateurs puis des professeurs...
//
// =====================================================================================
// Section des données: Ceci est temporaire! Ces données seront éventuellement ailleurs!
// =====================================================================================
//
// Nouveau format de l'objet CSP, qui est une définition formelle du problème. L'avantage d'avoir
// toutes les définitions à l'intérieur de l'objet est qu'il sera maintenant possible d'avoir des
// fichier JSON qui vont correspondre à un 'problem set'. On aura juste à loader ces fichiers au
// lieu de devoir définir nos éléments dans le code. De plus, ça va justifier l'utilisation de
// Node.js, car on aurait pas pu ouvrir des fichiers si on restait 'front-end'! :-)
//
// Information sur les objets de cours :
// Jours - "lundi", "mardi", "mercredi", "jeudi", "vendredi"
// Périodes - "AM", "PM", "SOIR"
// Niveau - 3 : "directeur", 2 : "professeur", 1 : "chargé de cours". directeur > professeur > chargé de cours
// Est-ce qu'on devrait faire mieux? (utiliser des strings?) Je crois que des Strings vont apporter moins de confusion..
//
// =====================================================================================
//                      Contraintes actuellement implémentées
// =====================================================================================
// - Un cours peut être assigné seulement une fois.
// - Un professeur ne peut pas donner 2 cours durant la même plage horaire.
// - Un professeur qui a une mauvaise évaluation pour le cours X, ne peut pas donner le cours X.
// - Le directeur a priorité sur tout.
// - Un professeur a priorité sur un chargé de cours.
// - Un prof a priorité sur un cours s'il est le dernier à  l'avoir donné. (Il perd la prio après 4 fois consécutives, pas impémenté)
// - Un PROFESSEUR ne peut pas donner plus de 2 cours.
// - Un CHARGE_DE_COURS ne peut donner plus de 4 cours.

// Plus simple des int pour l'heuristique et pour trier le array (voir fonction search).
var DIRECTEUR = 3,
PROFESSEUR = 2,
CHARGE_DE_COURS = 1;

var csp = {};

// *** ATTENTION SI GENERATEUR DONNE DES DONNÉES FAUSE LE SERVEUR NE PARTIRA PAS ***
//csp = require('./generateur.js').csp;
//console.log(csp)
// =================================================
// Section des algorithmes: Cette section va rester!
// =================================================
//
// Implémentation de 'Backtracking Search' récursif
// TODO:
//   - Ajouter les heuristiques
//   - Ajouter le arc-consistency (fonction 'inference')
//   - Transformer ça en algo itératif (si c'est trop lent!)
//
// Structure d'un objet 'assignment' (résolution en cours du problème):
// var assignment = {
//    prof1: [], // Ceci est une liste parce qu'éventuellement, on va assigner plus d'un cours par prof si désiré!
//    prof2: [],
//    prof3: []
//};
function search(csp) {
    var assignment = {},
        assignment_prof,
        assignment_charge;
    var professeurs = csp["professeurs"];

    if(validerMaxCours(professeurs)) {
        assignment_prof = initialiserAssignment(professeurs, PROFESSEUR);
        assignment_charge = initialiserAssignment(professeurs, CHARGE_DE_COURS);

        // On trie le tableau de professeurs dans l'objet csp selon le niveau en ordre décroissant.
        // directeur > professeur > chargé de cours
        professeurs.sort(function(a, b) {return b['niveau']-a['niveau']}); // TODO : Utiliser efficacement ce tri. Note à moi-même (P-O)

        if(professeurs[0]['niveau'] === DIRECTEUR) assignment = assignerDirecteur(csp);
    } else
        throw 'Un directeur peut donné un seul cours, un professeur peut donner un maximum de 2 cours et un chargé de cours un maximum de 4 cours.';

    backtrackingSearch(csp, assignment_prof, PROFESSEUR);
    var res = mergeAssignments(assignment_prof, assignment_charge);
    backtrackingSearch(csp, res, CHARGE_DE_COURS);

    return mergeAssignments(assignment, res);
}

function backtrackingSearch(csp, assignment, niveau) {
    if (isComplete(assignment)) return assignment;

    var professeur = selectNextUnassignedVariable(csp, niveau);
    var domaineProfesseur = orderDomainValues(professeur, assignment, csp);
    var result;

    for (var i = 0; i < domaineProfesseur.length; i++) {
        var cours = getCoursById(csp, domaineProfesseur[i]);
        var assignmentCopy = JSON.parse(JSON.stringify(assignment));

        addAssignment(professeur, cours["id"], assignment);

        if (isConsistent(cours, professeur, assignmentCopy)) {
			//Petit probleme : quand je passe cspCopy a AC3
			//Ceci cause des problemes avec la recursiviter
			//Je passe donc csp directement
			//var cspCopy = JSON.parse(JSON.stringify(csp));
			//var cspAC3 = AC3(csp,assignment);
            var result = backtrackingSearch(csp, assignment, niveau);
            if (result) break;
        }

        removeAssignment(professeur, cours, assignment);
    }
    return result;
}

// =================================================
//      Section des fonctions utilitaires
// =================================================

// Cette fonction retourne la liste des cours assignables à un professeur. C'est ici qu'on devra ajouter
// les heuristiques. C'est d'ailleurs pour ça qu'on passe en argument 'assignment'... En ayant 'assignment',
// on va pouvoir éliminer des valeurs possibles du domaine. Pour l'instant, on retourne juste la liste de
// cours désirés par le professeurs.
function orderDomainValues(professeur, assignment, csp) {
    return prioriteCoursDerniereSession(professeur, csp);
}

// Retourne si un professeur a une assignation complète.
function isAssigned(professeur) {
    return professeur["nombreCoursAssignes"] === professeur["nombreCoursDesires"];
}

// Un 'assignment' est complet si chacun des professeurs a un cours assigné. Ceci est construit de façon à
// pouvoir permettre un nombre illimité de professeurs.
function isComplete(assignment) {
    var professeurs = csp["professeurs"];

    for (var prof in assignment) {
        var professeur = getProfesseurById(csp, prof);
        if (!isAssigned(professeur)) return false;
    }
    return true;
};

// Va retourner la prochaine variable (professeur) qui n'est pas complètement assignée.
// TODO : éventuellement il faudrait sélectionner les profs par ancienneté.
function selectNextUnassignedVariable(csp, niveau) {
    var professeurs = csp["professeurs"];
    var profAAssigner = undefined;
    var tour = Infinity;

    for (var i = 0; i < professeurs.length; i++) {
        var professeur = professeurs[i];
        if(professeur['niveau'] === niveau && !isAssigned(professeur)) {
            if(professeur['nombreCoursAssignes'] < tour) {
                profAAssigner = professeur;
                tour = professeur['nombreCoursAssignes'];
            }
        }
    }
    return profAAssigner;
}

// Ces fonctions servent à assigner/désassigner un cours à un professeur. Éventuellement, il faudrait vérifier si
// le professeur et le cours existent sinon on garoche une exception!
function addAssignment(professeur, cours, assignment) {
    professeur["nombreCoursAssignes"]++;
    assignment[professeur.id].push(cours);
}

function removeAssignment(professeur, cours, assignment) {
    professeur["nombreCoursAssignes"]--;
    var professeur = assignment[professeur.id];
    professeur.splice(professeur.indexOf(cours), 1);
}

// Recherche d'un professeur par son 'id'
function getProfesseurById(csp, id) {
    var professeurs = csp["professeurs"];

    for (var i = 0; i < professeurs.length; i++) {
        if (professeurs[i].id === id) return professeurs[i];
    }

    throw "Le professeur ayant l'identifiant " + id + " n'existe pas!";
}

// Recherche d'un cours par son 'id'
function getCoursById(csp, id) {
    var cours = csp["coursDisponibles"];

    for (var i = 0; i < cours.length; i++) {
        if (cours[i].id === id) return cours[i];
    }

    throw "Le cours ayant l'identifiant " + id + " n'existe pas!";
}

// C'est ici qu'on va mettre toutes nos contraintes! Pour commencer, on va juste s'assurer que deux professeurs
// différents ne donnent pas le même cours. Éventuellement, on pourrait mettre chacunes des contraintes dans sa
// propre fonction!
function isConsistent(cours, professeur, assignment) {
    if (coursDejaAssigne(cours, assignment)) return false;
    if (mauvaiseEvaluation(cours, professeur, assignment)) return false;
    if (plageDejaAssignee(cours, professeur, assignment)) return false;

    // Autres checks de contraintes...

    return true;
}

// Retourne le plus grand nombre de cours désirés pour les PROFESSEURS ou CHARGE_DE_COURS.
// TODO : **POSSIBLEMENT USELESS**
function trouverMaxCoursDesires(professeurs, niveau) {
    var max = -Infinity;

    for (var i = 0; i < professeurs.length; i++) {
        if(professeurs[i]['niveau'] === niveau && professeurs[i]['nombreCoursDesires'] > max)
            max = professeurs[i]['nombreCoursDesires'];
    }
    return max;
};

// Initialise assignment
function initialiserAssignment(professeurs, niveau) {
    var assignment = {};

    for (var i = 0; i < professeurs.length; i++) {
        if(professeurs[i]['niveau'] === niveau) {
            var professeur = professeurs[i]['id'];
            assignment[professeur] = [];
        }
    }
    return assignment;
};

function mergeAssignments(assign1,assign2) {
    var assignment = {};
    for (var prof in assign1) assignment[prof] = assign1[prof];
    for (var prof in assign2) assignment[prof] = assign2[prof];
    return assignment;
};


// =================================================
//      Section fonctions AC3
// =================================================

//Passe une copie de csp
function AC3 (csp, assignment){
	var queue = remplirQueue(csp);
	while(queue.length != 0){
		var arcATraiter = queue.pop();
		// On verifie si il y a des valeurs inconsistentes
		if (removeValeurInconsistentes (csp, arcATraiter,assignment)){
			// Si oui, alors on ajoute la paire inverse a la queue
			var queueArc = new Array();
			queueArc.push(arcATraiter[1]);
			queueArc.push(arcATraiter[0]);
			queue.push(queueArc);
			// Verifie que le prof auquel on a supprimer le cours
			// ne possede pas 0 de length.
			var verificationProf = getProfesseurById(csp,arcATraiter[1])
			if(verificationProf["coursDesires"].length == 0)
			{
				return undefined;
			}
		}
	}
	return csp;
}

//Fonction qui supprime le cours identique dans xi
//si le domaine de xi est plus grand que le domaine de xj
//Cependant, je ne suis pas sur si c'est assez, c'est ce que moi
//et richard ont compris.
function removeValeurInconsistentes (csp, arcATraiter,assignment){
	var removed = false;
	var arcXi = getProfesseurById(csp, arcATraiter[0]);
	var arcXj = getProfesseurById(csp, arcATraiter[1]);

	var profAssignement = undefined;
	for ( var profId in assignment ){
		if(arcXi.id == profId){
			 profAssignement = profId;
		}
	}
	if(!profAssignement) return;

	//Domaine xi (Cours de arcXi) : correspond a profAssignement pour l'assignment
	for(i = 0 ; i < assignment[profAssignement].length; i++){
		//Domaine xj (Cours de arcXj)
		for(j = 0 ; j < arcXj["coursDesires"].length; j++){
			//Verifier si un cours de xi se retrouve dans xj
			//Si oui, alors on l'enleve de xj.
			if(assignment[profAssignement][i] == arcXj["coursDesires"][j])
			{
				arcXj["coursDesires"].splice(j,1);
				removed = true;

			}
		}
	}
	return removed;
}


//Fonction qui cree des pairs d'arcs avec les id des profs.
//Retourne une queue remplis des arcs
// donne : [ 'prof1', 'prof2' ]
function remplirQueue (csp){
	var queue = new Array();
	var professeurs = csp["professeurs"];
	for ( i = 0 ; i < professeurs.length; i++)
	{
		for( j = 0 ; j < professeurs.length; j++){
			//Creation d'un array temporaire pour "holder" les pairs
			var queueArc = new Array();
			if(professeurs[i].id != professeurs[j].id)
			{
				queueArc.push(professeurs[i].id)
				queueArc.push(professeurs[j].id);
				// On push alors les pair dans l'array que l'on retourne a la fin
				queue.push(queueArc);
			}
		}
	}
	return queue;
}


// =================================================
//      Section des fonctions d'heuristiques
// =================================================

// Ajuster le domaine d'un professeur si un de ses choix est un cours qui a été
// donné par un autre prof à la dernière session car ce dernier a priorité sur ce cours.
// TODO : Laid, mais fonctionnel.

//Ajout d'une validation du nombre de cours desires pour un professeur, s'il est à 0 ne pas retirer de la liste
//sinon on enlèvait un cours qui pouvait être pris par un autre professeur
function prioriteCoursDerniereSession(professeur, csp) {
    var professeurs = csp['professeurs'];
    var coursDesires = professeur['coursDesires'];

    for (var i = 0; i < professeurs.length; i++) {
        if(professeurs[i]['id'] !== professeur['id']) {
            var courant = professeurs[i];

            if(courant['coursSessionDerniere'].length > 0 && courant['nombreCoursDesires'] > 0) {
                var coursSessionDerniere = courant['coursSessionDerniere'];

                for(var j = 0; j < coursSessionDerniere.length; j++) {
                    var sigle = coursSessionDerniere[j].toLowerCase();

                    for(var k = 0; k < coursDesires.length; k++) {
                        var res = coursDesires[k].substr(0,7);

                        if(sigle === res) {
                            var index = coursDesires.indexOf(coursDesires[k]);
                            coursDesires.splice(index, 1);
                        }
                    }
                }
            }
        }
    }
    return coursDesires;
};

// Assigne le cours choisi au directeur et le retire des coursDesires des professeurs qui l'ont.
// Cette fonction assume qu'il n'y a qu'un seul directeur, car dans la réalité il n'y en a qu'un seul!
function assignerDirecteur(csp) {
    var professeurs = csp['professeurs'];
    var directeur = professeurs[0]; // tableau trié, le directeur sera toujours le premier, s'il existe.
    var cours = directeur['coursDesires'][0] // Peu importe le nombre de choix, son premier choix est toujours celui qu'il aura.
    var assignment = {};

    assignment[directeur['id']] = []
    addAssignment(directeur, cours, assignment);

    for(var i = 0; i < professeurs.length; i++) {
        if(professeurs[i]['id'] !== directeur['id']) {
            var coursDesires = professeurs[i]['coursDesires'];
            var coursSessionDerniere = professeurs[i]['coursSessionDerniere'];

            // Retire le cours du directeur de la liste de tous tous les profs, s'il existe.
            var index = coursDesires.indexOf(cours);
            if(index >= 0) coursDesires.splice(index, 1);

            // Retire le cours du directeur de la liste des cours de la session dernière de tous les profs, s'il existe
            // pour éviter du traitement en double dans la fonction prioriteCoursDerniereSession().
            var index = coursSessionDerniere.indexOf(cours);
            if(index >= 0) coursSessionDerniere.splice(index, 1);
        }
    }
    return assignment;
};

// =================================================
//      Section des fonctions de contraintes
// =================================================

// Est-ce que le cours est déjà assigné?
function coursDejaAssigne(cours, assignment) {
    for (var property in assignment) {
        if (assignment.hasOwnProperty(property)) {
            if (assignment[property].indexOf(cours.id) != -1) return true;
        }
    }

    return false;
}

// Est-ce que l'horaire du professeur permet l'ajout du cours?
// Ceci ne sera utilisé que quand il sera possible d'avoir plus qu'un cours par professeur...
function plageDejaAssignee(cours, professeur, assignment) {
    var coursDonnes = assignment[professeur.id];

    for (var i = 0; i < coursDonnes.length; i++) {
        var coursDonne = getCoursById(csp, coursDonnes[i]);
        if (coursDonne["jour"] == cours["jour"] && coursDonne["periode"] == cours["periode"]) return true;
    }

    return false;
}

// On prend le professeur qui vien de recevoir un cours assigner, puis on verifie
// que le cours n'est pas dans sa liste de cours ayant une mauvaise evaluation
// TODO : Comme prioriteCoursDerniereSession() Il ne faut pas utiliser les groupes cours pour comparer, seulement les sigles.
function mauvaiseEvaluation(cours, professeur, assignment) {
    for (i = 0; i < professeur["mauvaiseEvaluation"].length; i++) {
        if (cours["id"] == professeur["mauvaiseEvaluation"][i]) return true;
    }

    return false;
}

// - Un PROFESSEUR ne peut pas donner plus de 2 cours.
// - Un CHARGE_DE_COURS ne peut donner plus de 4 cours.
// Cette fonction existe seulement pour qu'on ne fasse pas d'erreur quand on crée des données manuellement
// et agit comme une contrainte.
function validerMaxCours(professeurs) {
    var MAX_DIRECTEUR = 1;
        MAX_PROFESSEUR = 2,
        MAX_CHARGE_DE_COURS = 4;

    for(var i = 0; i < professeurs.length; i++) {
        var courant = professeurs[i];

        if(courant['niveau'] === PROFESSEUR) {
            if(courant['nombreCoursDesires'] > MAX_PROFESSEUR) return false;

        } else if (courant['niveau'] === CHARGE_DE_COURS) {
            if(courant['nombreCoursDesires'] > MAX_CHARGE_DE_COURS) return false;

        } else {
            if(courant['nombreCoursDesires'] > MAX_DIRECTEUR) return false;
        }
    }
    return true;
};


// TODO: Une shitload de contraintes!


// Tests!
debugger;
// *** ATTENTION SI GENERATEUR DONNE DES DONNÉES FAUSE LE SERVEUR NE PARTIRA PAS ***
//var test = search(csp);
//console.log(test);

exports.search = function (cspSend){
	csp = cspSend;
    return search(csp);
}
