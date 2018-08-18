var mongoose = require("mongoose");
var StoryModel = require("./models")
var q = require("q");
let db = mongoose.connect("mongodb://localhost:27017/test", 
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
            "year": 0,
            "text": makeText()
        }
    };
    var async_funcs = [];
    for(var i = 0; i < decade.length; i++){
        for(var a = 0; a < coords.length; a++){
            var sp = storyParms;
            sp.context.year = decade[i] + a;
            sp.decade = decade[i];
            sp.location = coords[a]
            async_funcs.push(StoryModel.createFromObj(sp));
        }
    }

    q.all(async_funcs).then(function(){
        console.log("created new records!")
        process.exit();
    });

    //process.exit();

}



function clearDB(){
    StoryModel.deleteMany().then(function(v){
        console.log("collection cleared");
        process.exit();   
    })
}

if (process.argv[2] == "--clear"){
    clearDB();
}else{
    makeStoryRecords();
}
