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
var constants = require('./constants');
const multer = require("multer");
const upload = multer();
const s3bucket = "phla";
const AWS = require('aws-sdk');
var configs = JSON.parse(fs.readFileSync(__dirname + "/../../.env.local"));

AWS.config.update({
    accessKeyId: configs['ACCESS_CODE'],
    secretAccessKey: configs['SECRET'] 
  });

var s3 = new AWS.S3();

nunjucks.configure( __dirname + "/templates", {
    express:app,
    autoescape:true
});

var dbString = "mongodb://phla:" + configs['PHLA_PASS'] + "@phla-cluster-shard-00-00-1ojxn.mongodb.net:27017,phla-cluster-shard-00-01-1ojxn.mongodb.net:27017,phla-cluster-shard-00-02-1ojxn.mongodb.net:27017/test?ssl=true&replicaSet=PHLA-cluster-shard-0&authSource=admin&retryWrites=true";
app.use('/static', express.static(path.join(__dirname + '/./templates/static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
    if(!req.db){
    let db = mongoose.connect(dbString, function(err){
        if (err !== null){ 
            next(new Error("Could not connect to database!"));
        }else{
            req.db = db;
            next();
        }
    });
    }else{
        next();
    }
});



app.use(session({
    secret: configs['PHLA_KEY'],
    store: new MongoStore({ 
            url: dbString
        })
    })
);

app.use(function(req, res, next){
    if(req.path.search(/admin/) == 1 && !req.session.user){
        res.redirect("/login");
    }else{
        next();
    }
})

//error handler middleware
app.use(function(err, req, res, next){
    console.log("inside of error handler")
    res.render("error.html", {"error": err});
    
});

app.get('/', function (req, res) {
    console.log(req.db)
    res.render('index.html');
});

app.get('/login', function(req, res){
    res.render("admin_login.html");
})

app.post("/login", function(req, res){
    const req_body = req.body;
    if(req_body['username'] == "" && req_body['password'] == ""){
        res.render("admin_login.html", {show_error: true});
    }else if(req_body['username'] !== "admin" && req_body['password'] !== "admin"){
        res.render("admin_login.html", {show_error: true});
    }else{
        req.session.user = "Admin";
        res.redirect("/admin/dashboard");
    }
});

app.get("/admin/dashboard", (function(req, res){
    StoryModel.model.find().then((records) => {
        res.render("admin_dashboard.html", {
            stories: records,
            neighborhoods: StoryModel.neighborhoods
        });
    }, (err) => {
        console.log(err)
        res.render("admin_dashboard.html", {
            "error": "Could not finish the query at this moment"
        })
    })
    
}));

app.post("/admin/dashboard", upload.single('vid'), (function(req, res){
    const req_body = req.body;
    if(req.file){
        //upload the video to S3
        const fileParts = req.file.originalname.split(".")
        const newFileName = fileParts[0] + "_" + Date.now() + "." + fileParts[ fileParts.length - 1];
        s3.upload({
            Bucket: s3bucket,
            Body: req.file.buffer,
            Key: newFileName
        }, (err, success) => {
            if(success){
                console.log(success)
                StoryModel.model.createFromObj({
                    area:req_body['area'],
                    title:req_body['title'],
                    video:{
                        url: success.Location
                    }
                }).then((evt) => {
                    res.redirect("/admin/video/" + evt.id);
                }, (err) => {
                    res.render('admin_dashboard.html', {
                        "error":"Could not add a new story at this time"
                    });
                });
            }
            
            if(err){
                throw new Error(err);
            }

        });
    }else{
        StoryModel.model.createFromObj({
            area:req_body['area'],
            title:req_body['title']
        }).then((evt) => {
            res.redirect("/admin/video/" + evt.id);
        }, (err) => {
            res.render('admin_dashboard.html', {
                "error":"Could not add a new story at this time"
            });
        });
    }
}));

app.get("/admin/video/:id", function(req, res){
    StoryModel.model.findById(req.params['id']).then((record) => {
        res.render("admin_video.html", {
            story: record,
            neighborhoods: StoryModel.neighborhoods
        });
    }, (err) => {
        console.log(err);
        res.render("admin_video.html")
    })
});

app.post("/admin/video/:id", upload.single('vid'), function(req, res){
    if(req.file){
        //upload the video to S3
        const fileParts = req.file.originalname.split(".")
        const newFileName = fileParts[0] + "_" + Date.now() + "." + fileParts[ fileParts.length - 1];
        s3.upload({
            Bucket: s3bucket,
            Body: req.file.buffer,
            Key: newFileName
        }, (err, success) => {
            if(success){
                var updates = {
                    title: req.body['title'],
                    location: [req.body['lon'], req.body['lat']],
                    decade: req.body['decade'],
                    area: req.body['area'],
                    video: {
                        url: success.Location
                    }
                }
                StoryModel.model.findByIdAndUpdate(req.params['id'], updates,{
                    new: true
                }).then((record) =>{
                    res.render("admin_video.html", {
                        success:"Story updated!",
                        story:record,
                        neighborhoods: StoryModel.neighborhoods
                    });
                }, (err) => {
                    console.log(err);
                    res.render("admin_video.html", {
                        "error": "Could not update Story at this time"
                    });
                });
            }

            if(err){
                throw new Error(err);
            }
        })
    }else{
        var updates = {
            title: req.body['title'],
            location: [req.body['lon'], req.body['lat']],
            decade: req.body['decade'],
            area: req.body['area']
        }
        StoryModel.model.findByIdAndUpdate(req.params['id'], updates,{
            new: true
        }).then((record) =>{
            res.render("admin_video.html", {
                success:"Story updated!",
                story:record,
                neighborhoods: StoryModel.neighborhoods
            });
        }, (err) => {
            console.log(err);
            res.render("admin_video.html", {
                "error": "Could not update Story at this time"
            });
        });
    }
})

app.get("/admin/context/:id", function(req, res){
    StoryModel.model.findById(req.params['id']).then((record) =>{
        res.render("admin_context.html", {
            story:record,
            neighborhoods: StoryModel.neighborhoods
        });
    }, (err) => {
        console.log(err);
        res.render("admin_context.html", {
            "error": "Could not find that Story at this time"
        });
    });
});

app.post("/admin/context/:id", function(req, res){
    var updates = {
        context:{text: req.body['text']}
    }
    StoryModel.model.findByIdAndUpdate(req.params['id'], updates,{
        new: true
    }).then((record) =>{
        res.render("admin_context.html", {
            success:"Story updated!",
            story:record,
            neighborhoods: StoryModel.neighborhoods
        });
    }, (err) => {
        console.log(err);
        res.render("admin_context.html", {
            "error": "Could not update Story at this time"
        });
    });
});


app.post("/create/story", function(req, res){
    const req_body = req.body;
    StoryModel.model.createFromObj(req_body).then(function(v){
        console.log(v)
        res.send(v);
    });
     
});

app.get("/stories", function(req, res){
    StoryModel.model.find().then(function(v){
        res.send(v);
    });
});

app.get("/story/:id", function(req, res){
    StoryModel.model.find({"_id": req.params.id}).then(function(v){
        res.send(v);
    }, function(err){
        res.send(err);
    });
});

app.get("/story/decade/:decade", function(req, res){
    var decade = parseInt(req.params['decade'], 10);
    StoryModel.model.find({
        "decade": decade
    }).then(function(v){
        console.log("inside of decade")
        //switch up the long and lat to get it ready for leaflet
        function formatArea(val){
            var ret = null;
            for(var i = 0; i < constants.neighborhoods.length;  i++){
                if(constants.neighborhoods[i].value == val){
                    ret = constants.neighborhoods[i].label;
                    break;
                }
            }
            return ret;
        }
        for(var i = 0; i < v.length; i++){
            console.log(v[i])
            const a = formatArea(v[i].area)

            v[i] = Object.assign({}, v[i].toObject(), 
            {neighborhood: a, location: [v[i].location[1], v[i].location[0]]})
        }
        
        res.send(v);
    }).catch((err) => {
        console.log("error")
        console.log(err)
        res.send([]);
    })
});


app.listen(3000);
console.log("now listening on port 3000")