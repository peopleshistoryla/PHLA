var mongoose = require("mongoose");
var StoryModel = require("./models")
var constants = require("./constants")
var q = require("q");
var fs = require("fs");
var configs = JSON.parse(fs.readFileSync(__dirname + "/../../.env.local"));
var dbString = "mongodb://phla:" + configs['PHLA_PASS'] + "@phla-cluster-shard-00-00-1ojxn.mongodb.net:27017,phla-cluster-shard-00-01-1ojxn.mongodb.net:27017,phla-cluster-shard-00-02-1ojxn.mongodb.net:27017/test?ssl=true&replicaSet=PHLA-cluster-shard-0&authSource=admin&retryWrites=true";

let db = mongoose.connect(dbString, 
    function(err){});


function makeText(){
    return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempor nisl sit amet vulputate rutrum. Fusce felis ante, pretium quis mi vel, venenatis eleifend ante. Vestibulum vulputate nunc sit amet eleifend dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi arcu nulla, scelerisque eget diam nec, rhoncus convallis risus. Duis diam quam, tempor at porta vitae, gravida id est. Nunc nec tincidunt augue.

    Etiam vehicula vitae velit eu imperdiet. Sed urna est, placerat eu bibendum vitae, commodo vitae dolor. Curabitur pharetra lacus sed arcu tristique luctus. Morbi quis nulla metus. Vestibulum facilisis vel lectus non commodo. Sed enim arcu, accumsan a dignissim eget, sollicitudin eget lacus. Mauris eget velit sed purus luctus luctus in nec mi. Duis egestas elementum suscipit. Donec erat tortor, vehicula nec pulvinar ac, semper vitae leo. Ut a dolor eu orci viverra interdum. Maecenas sodales malesuada magna, vel congue purus finibus vitae. Aenean non nisi odio. Vestibulum vel fermentum nulla.`
}
var coords = [
    [34.005645, -118.344056],
    [34.013026, -118.339345],
    [34.02323, -118.346228],
    [34.019055, -118.337386],
    [34.006003, -118.399921],
    [34.019347, -118.396535],
    [34.031824, -118.252667],
    [34.042176, -118.241986],
    [34.076470, -118.259651],
    [34.076652, -118.268282],
    [34.087829, -118.329119],
    [34.097344, -118.333933],
    [33.955462, -118.358698],
    [33.946815, -118.357975],
    [34.056852, -118.299590],
    [34.054474, -118.307535],
    [34.054889, -118.364435],
    [34.056711, -118.364832],
    [34.056711, -118.364832],
    [34.058172, -118.336448],
    [34.022507, -118.490133],
    [34.086967, -118.358780],
    [34.093595, -118.363195]    
]

var decade  = [
    1970, 1980, 1990, 2000, 2010
];

function makeStoryRecords(){
    var storyParms = {
        "title":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ",
        "location": [],
        "decade":0,
        "area":0,
        "video": {
            "url": "https://youtu.be/zDKO6XYXioc",
            "credits": [
                "Mr. X", "TLC"
            ]
        },
        "context":{
            "credits":[
                "Shariq Torres", "TLC", "CSULA"
            ],
            "references": [
                {
                    "year":1998,
                    "publisher": "Dodo Brown",
                    "author": "Don Lemon",
                    "title": "Lemon is a fool!"
                }
            ],
            "year": 0,
            "text": makeText()
        }
    };
    var async_funcs = [];
    
    for(var i = 0; i < 23; i++){
        var sp = storyParms;
        var randomYearSuffix = Math.floor((Math.random() * 9) + 1);
        var randomYearPrefix = Math.floor((Math.random() * 4) + 1);
        sp.context.year = decade[ randomYearPrefix ] + randomYearSuffix;
        sp.decade = decade[randomYearPrefix];
        console.log(coords[i])
        console.log(i)
        sp.location = [coords[i][1], coords[i][0] ];
        switch(i){
            case 0:
            case 1:
                sp.area = constants.neighborhoods[0].value;
            break;
            case 2:
            case 3:
                sp.area = constants.neighborhoods[1].value;
            break;
            case 4:
            case 5:
                sp.area = constants.neighborhoods[2].value;
            break;
            case 6:
            case 7:
                sp.area = constants.neighborhoods[3].value;
            break;
            case 8:
            case 9:
                sp.area = constants.neighborhoods[4].value;
            break;
            case 10:
            case 11:
                sp.area = constants.neighborhoods[5].value;
            break;
            case 12:
            case 13:
                sp.area = constants.neighborhoods[6].value;
            break;
            case 14:
            case 15:
                sp.area = constants.neighborhoods[7].value;
            break;
            case 16:
            case 17:
                sp.area = constants.neighborhoods[8].value;
            break;
            case 18:
            case 19:
                sp.area = constants.neighborhoods[9].value;
            break;
            case 20:
            case 21:
                sp.area = constants.neighborhoods[10].value;
            break;
            case 22:
            case 23:
                sp.area = constants.neighborhoods[11].value;
            break;

        }
        async_funcs.push(StoryModel.model.createFromObj(sp));
        
    }

    q.all(async_funcs).then(function(){
        console.log("created new records!")
        process.exit();
    });
}



function clearDB(){
    StoryModel.model.deleteMany().then(function(v){
        console.log("collection cleared");
        process.exit();   
    })
}

if (process.argv[2] == "--clear"){
    clearDB();
}else{
    makeStoryRecords();
}
