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

// Section des données: Ceci est temporaire! Ces données seront éventuellement ailleurs!

// La liste 'coursDesires' est ordonnée. Le professeur préfère le cours de l'indice 0 à celui de l'indice 1...
var prof1 = {
    nom: "Harish Gunnarr",
    cle: "prof1",    // Ceci sera la clé de l'objet dans l'objet assignment... TODO: Faire mieux! :-)
    coursDesires: ["cours1", "cours3", "cours4", "cours5", "cours6"],
    nombreCoursDesires: 1,
    nombreCoursAssignes: 0
};

var prof2 = {
    nom: "Lucio Benjamin",
    cle: "prof2",
    coursDesires: ["cours1", "cours2", "cours3", "cours4", "cours5"],
    nombreCoursDesires: 1,
    nombreCoursAssignes: 0
};

var prof3 = {
    nom: "Mickey Hyakinthos",
    cle: "prof3",
    coursDesires: ["cours2", "cours3", "cours4", "cours5", "cours6"],
    nombreCoursDesires: 1,
    nombreCoursAssignes: 0
};

// Objet qui représente le problème simplifié -- Devra être généré automatiquement!
var csp = {
    // Professeurs à qui on doit assigner des cours
    professeurs: [prof1, prof2, prof3],
    // Pour simplifier, on utilise des 'strings' pour représenter des cours. Éventuellement, on va
    // plutôt utiliser des objets 'Cours', qui vont contenir plus d'information (horaire, etc)
    coursDisponibles: ["cours1", "cours2", "cours3", "cours4", "cours5", "cours6"]
};

// Puisque l'ordre des professeurs dans l'objet 'csp' est significatif, la solution à ce problème 
// simple devra être: prof1 -> cours1, prof2 -> cours2, prof3 -> cours3

// Structure d'un objet 'assignment' (résolution en cours du problème). Ceci devra éventuellement s'initialiser
// et se mettre à jour de façon automatique. On pourrait l'initialiser avec les listes des professeurs/cours afin
// qu'il se génère tout seul. En gros, ça devrait être une fonction constructeur plutôt qu'un objet.
var assignment = {
    prof1: [], // Ceci est une liste parce qu'éventuellement, on va assigner plus d'un cours par prof si désiré!
    prof2: [],
    prof3: []
};

// Implémentation de 'Backtracking Search' récursif
// TODO:
//   - Ajouter les heuristiques
//   - Ajouter le arc-consistency (fonction 'inference')
//   - Transformer ça en algo itératif (si c'est trop lent)
/*
function backtrackingSearch(csp) {
    return backtrackingSeach(csp, assignment);
}
*/
function backtrackingSearch(csp) {
    if (isComplete(csp)) return assignment;
    var professeur = selectNextUnassignedVariable(csp);
    var domaineProfesseur = orderDomainValues(professeur, assignment, csp);

    for (var i = 0; i < domaineProfesseur.length; i++) {
        var cours = domaineProfesseur[i];

        if (isConsistent(cours, assignment)) {
            addAssignment(professeur, cours, assignment);

            // TODO: Vérification du 'arc-consistency' ici!

            var result = backtrackingSearch(csp, assignment);        
            if (result) return result;            
        }

        //removeAssignment(professeur, cours, assignment);
    }

    return undefined;
}

// Cette fonction retourne la liste des cours assignables à un professeur. C'est ici qu'on devra ajouter
// les heuristiques. C'est d'ailleurs pour ça qu'on passe en argument 'assignment'... En ayant 'assignment',
// on va pouvoir éliminer des valeurs possibles du domaine. Pour l'instant, on retourne juste la liste de
// cours désirés par le professeurs.
function orderDomainValues(professeur, assignment, csp) {
    return professeur.coursDesires;
}

// Retourne si un professeur a une assignation complète.
function isAssigned(professeur) {
    return professeur.nombreCoursAssignes == professeur.nombreCoursDesires;
}

// Un 'assignment' est complet si chacun des professeurs a un cours assigné. Ceci est construit de façon à
// pouvoir permettre un nombre illimité de professeurs.
function isComplete(csp) {
    var professeurs = csp.professeurs;

    for (var i = 0; i < professeurs.length; i++) {
        if (!isAssigned(professeurs[i])) return false;
    }

    return true;
}

// Va retourner la prochaine variable (professeur) qui n'est pas complètement assignée. 
function selectNextUnassignedVariable(csp) {
    var professeurs = csp.professeurs;

    for (var i = 0; i < professeurs.length; i++) {
        var professeur = professeurs[i];
        if (professeur.nombreCoursAssignes < professeur.nombreCoursDesires) return professeur;
    }

    return undefined;
}

// Ces fonctions servent à assigner/désassigner un cours à un professeur. Éventuellement, il faudrait vérifier si
// le professeur et le cours existent sinon on garoche une exception!
function addAssignment(professeur, cours, assignment) {
    professeur.nombreCoursAssignes++;
    assignment[professeur.cle].push(cours);
}

function removeAssignment(professeur, cours, assignment) {
    professeur.nombreCoursAssignes--;
    var professeur = assignment[professeur.cle];
    professeur.splice(professeur.indexOf(cours), 1);
}

// C'est ici qu'on va mettre toutes nos contraintes! Pour commencer, on va juste s'assurer que deux professeurs
// différents ne donnent pas le même cours. Éventuellement, on pourrait mettre chacunes des contraintes dans sa
// propre fonction!
function isConsistent(cours, assignment) {
    if (coursDejaAssigne(cours, assignment)) return false;
    
    // Autres checks de contraintes...

    return true;
}

// Section des fonctions de contraintes!

// Est-ce que le cours est déjà assigné? 
function coursDejaAssigne(cours, assignment) {
    for (var property in assignment) {
        if (assignment.hasOwnProperty(property)) {
            if (assignment[property].indexOf(cours) != -1) return true;
        }
    }

    return false;
}

// TODO: Une shitload de contraintes!

// Tests! 
//debugger;
//var test = backtrackingSearch(csp);
//console.log(test);
