'use strict'

const fs = require("fs");

module.exports = function(templateName, cb){
    fs.readFile(__dirname + "/templates/" + templateName + ".html", "utf-8", (err, data) => {
        return cb(data);
    })
}