const express = require('express');
const app = express();
const path = require('path');
const templateRender = require("./render")

app.use('/static', express.static(path.join(__dirname + '/../build/static')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.get('/admin', function(req, res){
    templateRender("admin_login", (data)=>{
        res.send(data)
    });
})

app.listen(3000);