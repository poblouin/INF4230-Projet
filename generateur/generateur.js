var fs = require('fs');
var dummyjson = require('dummy-json');
var template = fs.readFileSync('./generateur/template.hbs', {encoding: 'utf8'});

// Data
var data = require('./data_generateur.js').data;

// Global vars
var array = []; // Utile pour fonction helpers coursSessionDerniere().
var index_cours = 0; // Utile pour fonctions helpers id_cours() et sigle().

// Helpers
var helpers = {
    cours: function(min, max) {
        var count = dummyjson.randomInt(min, max);
        var lower_bound = 0;
        var upper_bound = data['cours'].length-1;
        var unique_integer = [];

        while (unique_integer.length < count) {
            var random_integer = dummyjson.randomInt(lower_bound, upper_bound);
            if (unique_integer.indexOf(random_integer) == -1)
                unique_integer.push(random_integer);
        }

        for (var i = 0; i < unique_integer.length; i++) {
            var index = unique_integer[i];
            array.push("\"" + data['cours'][index] + "\"");
        }
        return array;
    },
    coursSessionDerniere: function() {
        if (dummyjson.randomBoolean()) {
            var lower_bound = 0;
            var upper_bound = array.length-1;
            var index = dummyjson.randomInt(lower_bound, upper_bound);
            var cours = "\"" + array[index].substr(1,7).toUpperCase() + "\"";
            return cours;
        }
    },
    mauvaiseEvaluation: function() {
        if (dummyjson.randomBoolean()) {
            var lower_bound = 0;
            var upper_bound = data['cours'].length-1;
            var index = dummyjson.randomInt(lower_bound, upper_bound);
            var cours = array[index];
            array = [];
            return cours;
        }
        array = [];
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
