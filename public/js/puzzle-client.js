// connect to the socket
var socket = io();
var board = $("#puzzle-board");
var puzzlePieces = $("#puzzle-board-pieces");
var puzzleEmpty = true;
var selectedPiece;
var animating = false;

socket.on('connect', function () {
    if (puzzleEmpty) {
        socket.emit('loadPuzzle');
    }
});

socket.on('receivePuzzle', function (data) {
    var pieceSize = 56;
    for (var i = 0; i < data.board.PuzzlePieces.length; i++) {
        for (var j = 0; j < data.board.PuzzlePieces[i].length; j++) {
            var piece = document.createElement("div");
            var img = document.createElement("img");
            img.draggable = false;
            piece.draggable = false;
            img.src = "./images/" + data.board.PuzzlePieces[i][j].Color + ".png";
            piece.style.top = (i * pieceSize).toString() + "px";
            piece.style.left = (j * pieceSize).toString() + "px";
            piece.className = "puzzle-piece";
            piece.appendChild(img);
            puzzlePieces.append(piece);

            $(piece).mousedown(function () {
                // Show start dragged position of image.
                selectedPiece = $(this);
            });
            $(piece).mouseenter(function () {
                if (selectedPiece) {
                    selectedPiece.swapWith($(this));
                    selectedPiece = undefined;
                }
            });
        }
    }
    puzzleEmpty = false;
});

$(document).mouseup(function () {
    selectedPiece = undefined;
});

puzzlePieces.mouseleave(function () {
    selectedPiece = undefined;
});

jQuery.fn.swapWith = function (to) {
    if (animating) {
        return;
    }
    animating = true;
    thisPos = $(this).position();
    toPos = $(to).position();
    $.when($(this).animate({
        top: toPos.top,
        left: toPos.left
    }, 600),
        $(to).animate({
            top: thisPos.top,
            left: thisPos.left
        }, 600)).done(function () {
            animating = false;
        });


};
