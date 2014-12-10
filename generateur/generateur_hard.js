var fs = require('fs');
var dummyjson = require('dummy-json');
var template = fs.readFileSync('./generateur/template_hard.hbs', {encoding: 'utf8'});

// Data
var data = require('./data_generateur.js').data;

// Global vars
var array = []; // Utile pour fonction helpers cours().
var index = 14; // Utile pour fonction helpers cours().
var index_cours = 0; // Utile pour fonctions helpers id_cours() et sigle().

// Helpers
var helpers = {
    cours: function() {
        if(array.length === 0) {
            for (var i = 0; i < index; i++)
                array.push("\"" + data['cours'][i] + "\"");
            return array;
        }
        array.pop();
        return array;
    },
    id_cours: function() {
        return data['cours'][index_cours];
    },
    sigle: function() {
        return data['sigles'][index_cours++];
    },
    jour: function() {
        var lower_bound = 0;
        var upper_bound = data['jours'].length-1;
        var index = dummyjson.randomInt(lower_bound, upper_bound);
        return data['jours'][index];
    },
    periode: function() {
        var lower_bound = 0;
        var upper_bound = data['periodes'].length-1;
        var index = dummyjson.randomInt(lower_bound, upper_bound);
        return data['periodes'][index];
    }
};

var result = dummyjson.parse(template, {data : data, helpers : helpers});
result = JSON.parse(result.replace(/&quot;/g,'"')); // Très laid, mais pas le choix de faire ca le template n'ajoute pas les " " automatiquement.
console.log(JSON.stringify(result));

exports.csp = result;
