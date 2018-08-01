const express = require('express');
const app = express();
const path = require('path');
const templateRender = require("./render")
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')

nunjucks.configure( __dirname + "/templates", {
    express:app,
    autoescape:true
});

app.use('/static', express.static(path.join(__dirname + '/./templates/static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    templateRender("index", (data) => {
        res.send(data);
    })
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
        res.redirect("/dashboard");
    }
});

app.get("/dashboard", (function(req, res){
    res.render("admin_dashboard.html");
}));

app.listen(3000);
console.log("now listening on port 3000")