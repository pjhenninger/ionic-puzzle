var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});


