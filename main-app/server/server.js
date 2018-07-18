const express = require('express');
const app = express();
const path = require('path');
const templateRender = require("./render")

app.use('/static', express.static(path.join(__dirname + '/./templates/static')));

app.get('/', function (req, res) {
    templateRender("index", (data) => {
        res.send(data);
    })
});

app.get('/admin', function(req, res){
    templateRender("admin_login", (data)=>{
        res.send(data)
    });
})

app.listen(3000);
console.log("now listening on port 3000")