// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app = angular.module('starter', ['ionic'])
    .run(function ($ionicPlatform) {

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });


    });

app.controller('myCtrl', function ($scope, $interval, $http) {
    $scope.puzzlePieces = [];
    $scope.pieceSize = 56;
    var puzzlePiecesJQ = $("#puzzle-board-pieces");
    var selectedPiece;
    var animating = false;

    $.ajax({
        url: '/api/createPuzzle',
        type: 'GET',
        data: '', // or $('#myform').serializeArray()
        success: function (data) { loadPuzzle(data) }
    });

    function loadPuzzle(colors) {
        $.each(JSON.parse(colors), function (i) {
            $scope.puzzlePieces[i] = [];
            $.each(this, function (j) {
                $scope.puzzlePieces[i][j] = this;
                //createPuzzlePiece(this.Color, i, j);
            })
        });
    }

    function createPuzzlePiece(color, rowIndex, columnIndex) {
        var piece = document.createElement("div");
        var img = document.createElement("img");
        img.draggable = false;
        piece.draggable = false;
        img.src = "img/" + color + ".png";
        piece.style.top = (rowIndex * pieceSize).toString() + "px";
        piece.style.left = (columnIndex * pieceSize).toString() + "px";
        piece.className = "puzzle-piece";
        piece.id = rowIndex + '|' + columnIndex;
        piece.appendChild(img);
        puzzlePiecesJQ.append(piece);

        $(piece).mousedown(function () {
            // Show start dragged position of image.
            selectedPiece = $(this);
        });
        $(piece).mouseenter(function () {
            if (selectedPiece && doPiecesTouch(selectedPiece, $(this), $scope.pieceSize)) {
                selectedPiece.swapWith($(this), function () {
                    checkForSpecificMatches(selectedPiece, $(this));
                });

                selectedPiece = undefined;
            }
        });
    }

    function checkForSpecificMatches(piece1, piece2) {

    }

    function checkForAllMatches() {

    }

    $(document).mouseup(function () {
        selectedPiece = undefined;
    });

    puzzlePiecesJQ.mouseleave(function () {
        selectedPiece = undefined;
    });

    $scope.pieceMouseDown = function ($event) {
        // Show start dragged position of image.
        selectedPiece = $($event.target.parentElement);
    }

    $scope.pieceMouseEnter = function ($event) {
        var enteredPiece = $event.target.parentElement;
        if (selectedPiece && doPiecesTouch(selectedPiece, $(enteredPiece), $scope.pieceSize)) {
            selectedPiece.swapWith($(enteredPiece), function () {
                checkForSpecificMatches(selectedPiece, $(enteredPiece));
            });

            selectedPiece = undefined;
        }
    }

    $scope.getAbsPos = function (rowIndex, columnIndex) {
        return { "top": (rowIndex * $scope.pieceSize + 'px'),
                 "left": (columnIndex * $scope.pieceSize + 'px') };
    }

    jQuery.fn.swapWith = function (to, callback) {
    //     var a = $scope.puzzlePieces[0][1];
    //     var c = $scope.puzzlePieces[0][0];
    //     $scope.puzzlePieces[0][0] = a;
    //     $scope.puzzlePieces[0][1] = c;
    //     $timeout(function(){
    //   			var tempX = a.xpos;
	// 					a.xpos = c.xpos;
	// 					c.xpos = tempX;

    // },10)
    var a = $scope.puzzlePieces[0][1];
         var c = $scope.puzzlePieces[1][1];
        animating = true;
        thisPos = this.position();
        toPos = to.position();
        $.when(this.animate({
            top: toPos.top,
            left: toPos.left
        }, 300),
            to.animate({
                top: thisPos.top,
                left: thisPos.left
            }, 300)).done(function () {
                animating = false;
                if (callback) {
                    callback();
                }
            });


    };
});

function doPiecesTouch(piece1, piece2, pieceSize) {
    return (piece1.prop('top') === piece2.prop('top') || piece1.prop('left') === piece2.prop('left'));
}





