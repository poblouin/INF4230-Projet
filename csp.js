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
// Niveau - "directeur", "professeur", "chargé de cours"
// Est-ce qu'on devrait faire mieux? (utiliser des strings?) Je crois que des Strings vont apporter moins de confusion..
var csp = {
    professeurs: [
        {
            id: "prof1",
            nom: "Harish Gunnarr",
            coursDesires: ["inf1120-00", "inf3105-10"],
            niveau: "chargé de cours",
            mauvaiseEvaluation : [],
            nombreCoursDesires: 1,
            nombreCoursAssignes: 0
        },
        {
            id: "prof2",
            nom: "Lucio Benjamin",
            coursDesires: ["inf2120-00"],
            niveau: "professeur",
            mauvaiseEvaluation : [],
            nombreCoursDesires: 1,
            nombreCoursAssignes: 0
        },
        {
            id: "prof3",
            nom: "Mickey Hyakinthos",
            coursDesires: ["inf1120-00"],
            niveau: "professeur",
            mauvaiseEvaluation : [],
            nombreCoursDesires: 1,
            nombreCoursAssignes: 0
        }
    ],
    coursDisponibles: [
        {
            id: "inf1120-00",
	        sigle: "INF1120",
	        jour: "lundi",
	        periode: "AM"
        },
        {
            id: "inf2120-00",
	        sigle: "INF2120",
	        jour: "lundi",
	        periode: "AM"
        },
        {
            id: "inf3105-10",
	        sigle: "INF3105",
	        jour: "mardi",
	        periode: "AM"
        },
        {
            id: "inf5000-22",
	        sigle: "INF5000",
	        jour: "mercredi",
	        periode: "SOIR"
        },
        {
            id: "inf4230-00",
	        sigle: "INF4230",
	        jour: "vendredi",
	        periode: "SOIR"
        }
    ]
};

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
    // On génère un objet 'assignment' selon les données du problèmes.
    var assignment = {};
    var professeurs = csp["professeurs"];

    for (var i = 0; i < professeurs.length; i++) {
        var professeur = professeurs[i]["id"];
        assignment[professeur] = [];
    }

    return backtrackingSearch(csp, assignment);
}

function backtrackingSearch(csp, assignment) {
    if (isComplete(csp)) return assignment;

    var professeur = selectNextUnassignedVariable(csp);
    var domaineProfesseur = orderDomainValues(professeur, assignment, csp);
    var result;

    for (var i = 0; i < domaineProfesseur.length; i++) {
        var cours = getCoursById(csp, domaineProfesseur[i]);
        var assignmentCopy = JSON.parse(JSON.stringify(assignment));

        addAssignment(professeur, cours["id"], assignment);

        if (isConsistent(cours, professeur, assignmentCopy)) {
            // TODO: Vérification du 'arc-consistency' ici!
            var result = backtrackingSearch(csp, assignment);
            if (result) break;
        }

        removeAssignment(professeur, cours, assignment);
    }

    return result;
}

// Cette fonction retourne la liste des cours assignables à un professeur. C'est ici qu'on devra ajouter
// les heuristiques. C'est d'ailleurs pour ça qu'on passe en argument 'assignment'... En ayant 'assignment',
// on va pouvoir éliminer des valeurs possibles du domaine. Pour l'instant, on retourne juste la liste de
// cours désirés par le professeurs.
function orderDomainValues(professeur, assignment, csp) {
    return professeur["coursDesires"];
}

// Retourne si un professeur a une assignation complète.
function isAssigned(professeur) {
    return professeur["nombreCoursAssignes"] == professeur["nombreCoursDesires"];
}

// Un 'assignment' est complet si chacun des professeurs a un cours assigné. Ceci est construit de façon à
// pouvoir permettre un nombre illimité de professeurs.
function isComplete(csp) {
    var professeurs = csp["professeurs"];

    for (var i = 0; i < professeurs.length; i++) {
        if (!isAssigned(professeurs[i])) return false;
    }

    return true;
}

// Va retourner la prochaine variable (professeur) qui n'est pas complètement assignée.
// Heuristique ajoutee : on selectionne le prof avec le moins de cours desires en premier.
function selectNextUnassignedVariable(csp) {
    var professeurs = csp["professeurs"];
	var plusCourtNbrCours = Infinity;
	var profAAssigner = undefined;
	for (var i = 0; i < professeurs.length; i++) {
        var professeur = professeurs[i];
		var longueur = professeur.coursDesires.length;
		// Il s'agit du directeur et qu'il y a des cours, alors il est le premier a choisir.
		// On peux quitter la boucle et le retourner.
		if(professeur.niveau == "directeur" && professeur.nombreCoursAssignes < professeur.nombreCoursDesires){
			profAAssigner = professeur;
			break;
		}
		else if(longueur < plusCourtNbrCours && professeur.nombreCoursAssignes < professeur.nombreCoursDesires){
			plusCourtNbrCours = longueur;
			profAAssigner = professeur;
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

// Section des fonctions de contraintes!

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
function mauvaiseEvaluation(cours, professeur, assignment) {
    for (i = 0; i < professeur["mauvaiseEvaluation"].length; i++) {
        if (cours["id"] == professeur["mauvaiseEvaluation"][i]) return true;
    }

    return false;
}

// TODO: Une shitload de contraintes!

// Tests!
debugger;
var test = search(csp);
console.log(test);

exports.search = function (cspSend){
	console.log(cspSend);
	return search(cspSend);
}
