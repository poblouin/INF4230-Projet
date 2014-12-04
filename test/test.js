// TEST DE BASE
/*var csp = {
    professeurs: [
    {
        id: "prof1",
        nom: "Harish Gunnarr",
        coursDesires: ["inf1120-00", "inf3105-10", "inf4230-00", "inf5000-22", "inf2120-00"],
        niveau: CHARGE_DE_COURS,
        coursSessionDerniere: [],
        mauvaiseEvaluation : ["inf1120-00"],
        nombreCoursDesires: 2,
        nombreCoursAssignes: 0
    },
    {
        id: "prof2",
        nom: "Lucio Benjamin",
        coursDesires: ["inf2120-00", "inf3105-10", "inf2015-40"],
        niveau: PROFESSEUR,
        coursSessionDerniere: [],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 2,
        nombreCoursAssignes: 0
    },
    {
        id: "prof3",
        nom: "Mickey Hyakinthos",
        coursDesires: ["inf2120-00", "inf4375-10"],
        niveau: PROFESSEUR,
        coursSessionDerniere: ["INF2120"],
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
    },
    {
        id: "inf4375-10",
        sigle: "INF4375",
        jour: "jeudi",
        periode: "SOIR"
    },
    {
        id: "inf2015-40",
        sigle: "INF2015",
        jour: "vendredi",
        periode: "PM"
    }
    ]
};*/

// TEST PLUS COMPLEXE, NOTAMMENT POUR TESTER LE CONCEPT DE 1ER TOUR 2E TOUR, ETC.
var csp = {
    professeurs: [
    {
        id: "prof1",
        nom: "Harish Gunnarr",
        coursDesires: ["inf1120-00", "inf3105-10", "inf4230-00", "inf5000-22", "inf2120-00", "inm6000-20"],
        niveau: CHARGE_DE_COURS,
        coursSessionDerniere: [],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 2,
        nombreCoursAssignes: 0
    },
    {
        id: "prof2",
        nom: "Lucio Benjamin",
        coursDesires: ["inf2120-00", "inf2015-40", "inf1120-00", "inm6000-20", "inf3105-10", "inf5000-22", "inf4230-00", "inf3135-20"],
        niveau: CHARGE_DE_COURS,
        coursSessionDerniere: ["INF1120"],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 4,
        nombreCoursAssignes: 0
    },
    {
        id: "prof3",
        nom: "Mickey Hyakinthos",
        coursDesires: ["inf2120-00", "inf3143-40", "inf4375-10", "inm6000-20"],
        niveau: PROFESSEUR,
        coursSessionDerniere: ["INF3143"],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 1,
        nombreCoursAssignes: 0
    },
    {
        id: "prof4",
        nom: "John Ferguson",
        coursDesires: ["inf2120-00", "inf4375-10", "inf5000-22", "inf3143-40", "inf6431-80"],
        niveau: PROFESSEUR,
        coursSessionDerniere: ["INF6431"],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 1,
        nombreCoursAssignes: 0
    },
    {
        id: "prof5",
        nom: "Miley Cyrus",
        coursDesires: ["inf4375-10", "inf1120-00", "inf2120-00", "inf2015-40", "inf2120-00"],
        niveau: PROFESSEUR,
        coursSessionDerniere: ["INF2120", "INF2015"],
        mauvaiseEvaluation : [],
        nombreCoursDesires: 2,
        nombreCoursAssignes: 0
    },
    {
        id: "prof6",
        nom: "Frank Underwood",
        coursDesires: ["inf6431-80"],
        niveau: DIRECTEUR,
        coursSessionDerniere: [],
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
        id: "inm6000-20",
        sigle: "INM6000",
        jour: "mardi",
        periode: "PM"
    },
    {
        id: "inf3135-20",
        sigle: "INF3135",
        jour: "mercredi",
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
    },
    {
        id: "inf4375-10",
        sigle: "INF4375",
        jour: "jeudi",
        periode: "SOIR"
    },
    {
        id: "inf2015-40",
        sigle: "INF2015",
        jour: "vendredi",
        periode: "PM"
    },
    {
        id: "inf3143-40",
        sigle: "INF3143",
        jour: "mardi",
        periode: "SOIR"
    },
    {
        id: "inf6431-80",
        sigle: "INF6431",
        jour: "lundi",
        periode: "AM"
    }
    ]
};
// RESULTS
/*{ prof6: [ 'inf6431-80' ],
prof3: [ 'inf3143-40' ],
prof4: [ 'inf4375-10' ],
prof5: [ 'inf2120-00', 'inf2015-40' ],
prof1: [ 'inf3105-10', 'inf4230-00' ],
prof2: [ 'inf1120-00', 'inm6000-20', 'inf5000-22', 'inf3135-20' ] }*/
