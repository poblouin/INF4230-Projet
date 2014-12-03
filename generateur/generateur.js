var fs = require('fs');
var dummyjson = require('dummy-json');
var template = fs.readFileSync('./generateur/template.hbs', {encoding: 'utf8'});

// Data
var data = require('./data_generateur.js').data;
/*{
    cours : ["INF1120-10",
             "INF2120-20",
             "INF2160-30",
             "INF2170-40",
             "INF3105-50",
             "INF3135-10",
             "INF3143-20",
             "INF3172-30",
             "INF3180-40",
             "INF3270-50",
             "INF4170-10",
             "INF4375-20",
             "INF5151-30",
             "INF5153-40",
             "INF5180-50",
             "INF6150-10",
             "INF1130-20",
             "MAT1600-30",
             "MAT4681-40",
             "ECO1081-50",
             "MET1105-10",
             "ORH1163-20",
             "INM6000-30",
             "INM5151-40",
             "INF2015-50",
             "INF4100-10",
             "INF4150-20",
             "INF5000-30",
             "INF5071-40",
             "INF5171-50",
             "INF6160-10",
             "INF2005-10",
             "INF3005-20",
             "INF4470-30",
             "INF4482-40",
             "INF4175-50",
             "INF5270-10",
             "INF5371-20",
             "TEL4165-30",
             "INF4230-40",
             "INF5281-50",
             "MET4901-10",
             "MET5311-20",
             "MET5510-30",
             "MET5903-40",
             "MET6910-50",
             "INF4500-10",
             "INF7210-20",
             "INF7235-30",
             "BIF7100-40",
             "BIF7101-50"],
    sigles : ["INF1120",
             "INF2120",
             "INF2160",
             "INF2170",
             "INF3105",
             "INF3135",
             "INF3143",
             "INF3172",
             "INF3180",
             "INF3270",
             "INF4170",
             "INF4375",
             "INF5151",
             "INF5153",
             "INF5180",
             "INF6150",
             "INF1130",
             "MAT1600",
             "MAT4681",
             "ECO1081",
             "MET1105",
             "ORH1163",
             "INM6000",
             "INM5151",
             "INF2015",
             "INF4100",
             "INF4150",
             "INF5000",
             "INF5071",
             "INF5171",
             "INF6160",
             "INF2005",
             "INF3005",
             "INF4470",
             "INF4482",
             "INF4175",
             "INF5270",
             "INF5371",
             "TEL4165",
             "INF4230",
             "INF5281",
             "MET4901",
             "MET5311",
             "MET5510",
             "MET5903",
             "MET6910",
             "INF4500",
             "INF7210",
             "INF7235",
             "BIF7100",
             "BIF7101"],
    jours : ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    periodes : ["AM", "PM", "SOIR"]
};*/

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
            array = [];
            return cours;
        }
        array = [];
    },
    mauvaiseEvaluation: function() {
        if (dummyjson.randomBoolean()) {
            var lower_bound = 0;
            var upper_bound = data['cours'].length-1;
            var index = dummyjson.randomInt(lower_bound, upper_bound);
            var cours = "\"" + data['cours'][index] + "\"";
            return cours;
        }
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
//console.log(JSON.stringify(result));

exports.csp = result;
