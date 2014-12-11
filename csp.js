// =====================================================================================
//                               Projet final INF4230
// =====================================================================================
//
//  Auteurs :
//  Samuel Lambert // LAMS05028203
//  Pierre-Olivier Blouin // BLOP11068701
//  Richard Pigeon // PIGR28059108
//  Marc-André Poulette // POUM24058905
//
//  Ce programme fait la gestion d'horaire pour les professeurs de l'UQAM.
//  Il implémente un algorithme CSP tel que vu dans le cours. Il est aussi
//  possible d'ajouter l'option pour utiliser l'algorithme AC-3 (voir README.txt).
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

// Constantes pour les niveaux.
var DIRECTEUR = 3,
PROFESSEUR = 2,
CHARGE_DE_COURS = 1;

var csp = {};

// TODO: Effacer ceci avant la remise quand front-end sera 100% fonctionnel.
//csp = require('./generateur/generateur_hard.js').csp; // Uncomment pour utiliser le générateur.

/*var fs = require('fs');   // Uncomment ces 3 lignes pour utiliser les fichiers tests csp.json ou csp2.json qui sont 2 problème solvable généré par le générateur
var json = fs.readFileSync('./test/csp_hard_4.json', {encoding: 'utf8'});
csp = JSON.parse(json);*/

// =================================================
//              Section des algorithmes
// =================================================
// TODO: Il faudrait éventuellement envoyer un objet de paramètres à
// cette fonction afin de savoir quels algorithmes de recherche utiliser
// Je vais gosser la dessus éventuellement!
//
// ex: search(csp, { algo: "naif" });
//     search(csp, { algo: "backtracking", forward: true, ac3: true };
function search(csp, ac3) {
    var assignment;
    var professeurs = csp["professeurs"];

    if(validerMaxCours(professeurs)) {
        assignment = initialiserAssignment(professeurs);

        // On trie le tableau de professeurs dans l'objet csp selon le niveau en ordre décroissant.
        // directeur > professeur > chargé de cours
        professeurs.sort(function(a, b) {return b['niveau']-a['niveau']});

        if(professeurs[0]['niveau'] === DIRECTEUR) assignerDirecteur(csp, assignment);
    } else {
        throw 'Un directeur peut donner un seul cours, un professeur peut donner un maximum de 2 cours et un chargé de cours un maximum de 4 cours.';
    }

    if (ac3) {
        var problemeValide = arcConsistency(csp);
        if (!problemeValide) throw "Le problème est impossible à résoudre!";
    }

	backtrackingSearch(csp, assignment);

    return assignment;
}

function backtrackingSearch(csp, assignment) {
    if (isComplete(assignment)) return assignment;

    var professeur = selectNextUnassignedVariable(csp, PROFESSEUR);
    if (!professeur) professeur = selectNextUnassignedVariable(csp, CHARGE_DE_COURS);

    var domaineProfesseur = orderDomainValues(professeur, assignment, csp);
    var result;

    for (var i = 0; i < domaineProfesseur.length; i++) {
        var cours = getCoursById(csp, domaineProfesseur[i]);
        var assignmentCopy = JSON.parse(JSON.stringify(assignment));

        addAssignment(professeur, cours["id"], assignment);

        if (isConsistent(cours, professeur, assignmentCopy)) {
            var result = backtrackingSearch(csp, assignment);
            if (result) break;
        }

        removeAssignment(professeur, cours, assignment);
    }
    return result;
}

// Implémentation de l'algorithme AC3
// Retourne 'false' si une inconsistence à été trouvée, sinon retourne 'true'.
function arcConsistency(csp) {
    var queue = buildQueue(csp);

    while (queue.length != 0) {
        var tuple = queue.shift();
        var domain = getProfesseurById(csp, tuple["x"])["coursDesires"];

        if (revise(csp, tuple)) {
            if (domain.size == 0) return false;

            for (var i = 0; i < csp["professeurs"].length; i++) {
                var prof = csp["professeurs"][i]["id"];

                if (prof == tuple["x"] || prof == tuple["y"]) continue;
                queue.push({x: prof, y: tuple["x"]});
            }
        }
    }

    return true;
}

// Est-ce qu'on doit réviser le domaine pour le rendre consistant?
// Cette fonction gère la suppression des éléments inconsistants.
function revise(csp, tuple) {
    var revised = false;
    var domainX = getProfesseurById(csp, tuple["x"])["coursDesires"];
    var domainY = getProfesseurById(csp, tuple["y"])["coursDesires"];

    for (var i = 0; i < domainX.length; i++) {
        var value = domainX[i];

        if (!validDomain(value, domainY)) {
            domainX.splice(i, 1);
            revised = true;
        }
    }
    return revised;
}

// Est-ce que l'utilisation de 'value' rend 'domain' inconsistent?
function validDomain(value, domain) {
    if (domain.indexOf(value) != -1) return domain.length > 1;
    return true;
}

// Fabrication de la queue initiale pour l'exécution de AC3.
function buildQueue(csp) {
    var profs = csp["professeurs"];
    var queue = [];

    for (var i = 0; i < profs.length; i++) {
        for (var j = 0; j < profs.length; j++) {
            if (i != j) queue.push({x: profs[i]["id"], y: profs[j]["id"]});
        }
    }
    return queue;
}

// =================================================
//      Section des fonctions utilitaires
// =================================================

// Cette fonction retourne la liste des cours assignables à un professeur.
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

// Retourne si assignment est consistant en fonction des contraintes.
function isConsistent(cours, professeur, assignment) {
    if (coursDejaAssigne(cours, assignment)) return false;
    if (mauvaiseEvaluation(cours, professeur, assignment)) return false;
    if (plageDejaAssignee(cours, professeur, assignment)) return false;
    return true;
}

// Initialise assignment
function initialiserAssignment(professeurs) {
    var assignment = {};

    for (var i = 0; i < professeurs.length; i++) {
        var professeur = professeurs[i]['id'];
        assignment[professeur] = [];
    }
    return assignment;
};

// =================================================
//      Section des fonctions d'heuristiques
// =================================================

// Ajuster le domaine d'un professeur si un de ses choix est un cours qui a été
// donné par un autre prof à la dernière session car ce dernier a priorité sur ce cours.
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
function assignerDirecteur(csp, assignment) {
    var professeurs = csp['professeurs'];
    var directeur = professeurs[0]; // tableau trié, le directeur sera toujours le premier, s'il existe.
    var cours = directeur['coursDesires'][0] // Peu importe le nombre de choix, son premier choix est toujours celui qu'il aura.

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
function plageDejaAssignee(cours, professeur, assignment) {
    var coursDonnes = assignment[professeur.id];

    for (var i = 0; i < coursDonnes.length; i++) {
        var coursDonne = getCoursById(csp, coursDonnes[i]);
        if (coursDonne["jour"] == cours["jour"] && coursDonne["periode"] == cours["periode"]) return true;
    }
    return false;
}

// On prend le professeur qui vien de recevoir un cours assigner, puis on verifie
// que le cours n'est pas dans sa liste de cours ayant une mauvaise évaluation.
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

// Tests!
//debugger;
/*var test = search(csp);
console.log(test);*/

exports.search = function (cspSend){
	csp = cspSend;
	var start = new Date().getTime();
	var ret = search(csp);
	ret.tempsExecution = new Date()-start;
	console.log("temps d'execution: " + ret.tempsExecution + "ms");
    return ret;
}
