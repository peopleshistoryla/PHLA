var mongoose = require("mongoose");
var StoryModel = require("./models")
var randomNeighborhood = require("./models")
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
    [-118.428758, 34.041645],
    [-118.337409, 34.012165],
    [-118.322878, 34.040587],
    [-118.273536, 34.067862]
]

var decade  = [
    1970, 1980, 1990, 2000, 2010
];

function makeStoryRecords(){
    var storyParms = {
        "title":"That time in Westside Pavilion",
        "location": [],
        "decade":0,
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
    
    for(var i = 0; i < 24; i++){
        var randomLocation = Math.floor((Math.random() * 24) + 1); 
        var randomNeighborhood = Math.floor((Math.random() * 12) + 1);
        var sp = storyParms;
        var randomYearSuffix = Math.floor((Math.random() * 14) + 1);
        var randomYearPrefix = Math.floor((Math.random() * 4) + 1);
        sp.context.year = decade[ randomYearPrefix ] + randomYearSuffix;
        sp.decade = decade[randomYearPrefix];
        sp.location = coords[ randomLocation ];
        sp.area = randomNeighborhood;
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
