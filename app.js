var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(3000);
var puzzleBoard = require('./dist/components/PuzzleBoard.js');

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.get('/api/createPuzzle', function (request, response) {    
    response.send((new puzzleBoard.PuzzleBoard()).toJSON());
});

app.get('/api/getPieces', function (request, response) {    
    response.send((new puzzleBoard.PuzzleBoard()).getRandomPieces(500));
});
