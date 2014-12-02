var fs = require('fs');
var dummyjson = require('dummy-json');
var template = fs.readFileSync('template.hbs', {encoding: 'utf8'});

// Data
var data = {
    cours : ["inf1120-00","inf2120-00","inf3105-10","inm6000-20","inf3135-20","inf5000-22","inf4230-00","inf4375-10","inf2015-40","inf3143-40","inf6431-80"]
};

// Helpers
var array = [];
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
        var lower_bound = 0;
        var upper_bound = array.length-1;
        var index = dummyjson.randomInt(lower_bound, upper_bound);
        var cours = "\"" + array[index].substr(1,7).toUpperCase() + "\"";
        array = [];
        return cours;
    }
};

var result = dummyjson.parse(template, {data : data, helpers : helpers});
result = JSON.parse(result.replace(/&quot;/g,'"')); // Très laid, mais pas le choix de faire ca le template n'ajoute pas les " " automatiquement.
fs.writeFile('file.json',JSON.stringify(result));
console.log(JSON.stringify(result));
