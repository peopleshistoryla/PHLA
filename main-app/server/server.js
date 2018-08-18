const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const StoryModel = require("./models");
const fs = require("fs");

nunjucks.configure( __dirname + "/templates", {
    express:app,
    autoescape:true
});

var configs = JSON.parse(fs.readFileSync(__dirname + "/../../.env.local"));
var dbString = "mongodb://phla:" + configs['PHLA_PASS'] + "@phla-cluster-shard-00-00-1ojxn.mongodb.net:27017,phla-cluster-shard-00-01-1ojxn.mongodb.net:27017,phla-cluster-shard-00-02-1ojxn.mongodb.net:27017/test?ssl=true&replicaSet=PHLA-cluster-shard-0&authSource=admin&retryWrites=true";
app.use('/static', express.static(path.join(__dirname + '/./templates/static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
    let db = mongoose.connect(dbString, function(err){
        if (err !== null){ 
            next(new Error("Could not connect to database!"));
        }else{
            req.db = db;
            next();
        }
    });
});

app.use(session({
    secret: configs['PHLA_KEY'],
    store: new MongoStore({ 
            url: dbString
        })
    })
);

//error handler middleware
app.use(function(err, req, res, next){
    console.log("inside of error handler")
    res.render("error.html", {"error": err});
    
});

app.get('/', function (req, res) {
    console.log(req.db)
    res.render('index.html');
});

app.get('/admin', function(req, res){
    res.render("admin_login.html");
})

app.post("/admin", function(req, res){
    const req_body = req.body;
    if(req_body['username'] == "" && req_body['password'] == ""){
        res.render("admin_login.html", {show_error: true});
    }else if(req_body['username'] !== "admin" && req_body['password'] !== "admin"){
        res.render("admin_login.html", {show_error: true});
    }else{
        req.session.user = "Admin";
        res.redirect("/dashboard");
    }
});


app.post("/create/story", function(req, res){
    const req_body = req.body;
    StoryModel.createFromObj(req_body).then(function(v){
        console.log(v)
        res.send(v);
    });
     
});

app.get("/stories", function(req, res){
    StoryModel.find().then(function(v){
        res.send(v);
    });
});

app.get("/story/:id", function(req, res){
    StoryModel.find({"_id": req.params.id}).then(function(v){
        res.send(v);
    }, function(err){
        res.send(err);
    });
});

app.get("/story/decade/:decade", function(req, res){
    var decade = parseInt(req.params['decade'], 10);
    StoryModel.find({
        "decade": decade
    }).then(function(v){
        res.send(v);
    })
});

app.get("/dashboard", (function(req, res){
    res.render("admin_dashboard.html");
}));

app.get("/dashboard/video/:id", function(req, res){
    res.render("admin_video.html");
});

app.get("/dashboard/context/:id", function(req, res){
    res.render("admin_context.html");
});

app.listen(3000);
console.log("now listening on port 3000")