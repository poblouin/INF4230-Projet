Pour partir l'application avoir node.js
Entrer la commande npm start
Si message d'erreur, veuillez telecharger les fichiers manquant avec npm
	ex: npm intall (moduleManquant)

Pour debug : npm install -g node-inspector apres npm-debug server.js

Les requetes disponible
 - /index.html -> Affiche l'interface pour l'utilisateur
 - /api/CSP -> retourne la solution du csp
 - /CSPs/:index -> retourne le csp dans le dossier spécifié
 
 Post: 
 -api/createCSP -> modifie le CSP
