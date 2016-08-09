// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])


    .run(function ($ionicPlatform) {
        var board = $("#puzzle-board");
        var puzzlePieces = $("#puzzle-board-pieces");
        var selectedPiece;
        var swappedPiece;
        var animating = false;
        var pieceSize = 56;
        var puzzleSize = 8;
        var columnMissingPieces = [];
        var matchMade = false;
        var storagePieces = [];

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

            $.ajax({
                url: '/api/createPuzzle',
                type: 'GET',
                data: '', // or $('#myform').serializeArray()
                success: function (data) { loadPuzzle(data) }
            });

            getPieces();
        });

        function getPieces() {
            $.ajax({
                url: '/api/getPieces',
                type: 'GET',
                data: '', // or $('#myform').serializeArray()
                success: function (data) { loadPieces(data) }
            });
        }

        function loadPieces(colors) {
            $.each(JSON.parse(colors), function (i) {
                storagePieces.push(this);
            });
        }

        function loadPuzzle(colors) {
            $.each(JSON.parse(colors), function (i) {
                $.each(this, function (j) {
                    createPuzzlePiece(this.Color, i, j);
                })
            });
        }

        function createPuzzlePiece(color, rowIndex, columnIndex, callback) {
            var piece = document.createElement("div");
            var img = document.createElement("img");
            img.draggable = false;
            piece.draggable = false;
            img.src = "img/" + color + ".png";
            img.id = color;
            piece.className = "puzzle-piece";
            piece.id = rowIndex + '-' + columnIndex;
            piece.appendChild(img);
            puzzlePieces.append(piece);
            piece.style.left = (columnIndex * pieceSize).toString() + "px";
            piece.style.top = "0px";
            $.when($(piece).animate({
                top: $(piece).position().top + (rowIndex * pieceSize)
            }, 300)).done(function(){
                if(callback){
                    callback();
                }
            });

            $(piece).mousedown(function () {
                // Show start dragged position of image.
                selectedPiece = $(this);
            });
            $(piece).mouseenter(function () {
               
                if (selectedPiece && doPiecesTouch(selectedPiece, $(this), pieceSize)) {
                    selectedPiece.swapWith($(this), function () {
                        checkMatches(getPieceObject(selectedPiece), getPieceObject(swappedPiece), function () {
                            if (matchMade) {
                                cascade(function () {
                                    createAndDropPiece(function () {
                                        checkForAllMatchesAndCascade(function () {
                                            selectedPiece = undefined;
                                            swappedPiece = undefined;
                                            animating = false;
                                            if (storagePieces.length < 50) {
                                                getPieces();
                                            }
                                        });
                                    });
                                });
                            }
                            else {
                                selectedPiece = undefined;
                                swappedPiece = undefined;
                                animating = false;
                            }
                        });
                    });
                }
            });
        }

        function createAndDropPiece(callback) {
            var farthestMissingPiece = 0;
            for (var i = 0; i < puzzleSize; i++){
                if(columnMissingPieces[i]){
                    farthestMissingPiece = i;
                }
            }

            for (var i = 0; i < puzzleSize; i++) {
                var missingPieces = columnMissingPieces[i];
                if (missingPieces) {
                    for (var j = missingPieces.count; j > 0; j--) {
                        var piece = storagePieces[0];
                        storagePieces.splice(0, 1);
                        createPuzzlePiece(piece.Color, j - 1, i, function () {
                            if ($.timers.length === 1 && callback) { // any page animations finished                                                              
                                callback();
                            }
                        });
                    }
                    columnMissingPieces[i] = undefined;
                }
            }
        }

        function cascade(callback) {
            if (matchMade) {
                for (var i = puzzleSize; i >= 0; i--) {
                    var missingPieces = columnMissingPieces[i];
                    if (missingPieces) {
                        for (var j = puzzleSize; j >= 0; j--) {
                            var piece = $('#' + j + '-' + i);
                            if (piece.length > 0 && j < missingPieces.row) {
                                piece.attr('id', ((j + missingPieces.count) + '-' + i));
                                $.when(piece.animate({
                                    top: piece.position().top + (pieceSize * missingPieces.count)
                                }, 300)).done(function () {
                                    if ($.timers.length === 1 && callback) {
                                        callback();
                                    }
                                });
                            }
                        }
                    }
                }
                if ($.timers.length === 1 && callback) {
                    callback();
                }
            }
        }

        function checkMatches(piece1, piece2, callback) {
            matchMade = false;
            checkForSpecificMatch(piece1);
            checkForSpecificMatch(piece2);
            if (callback) {
                callback();
            }
        }

        function checkForSpecificMatch(piece) {
            var rowMatches = [piece];
            var columnMatches = [piece];
            for (var i = piece.column - 1; i >= 0; i--) {
                var checkMatch = getPieceObject($('#' + piece.row + '-' + i));
                if (checkMatch.color === piece.color) {
                    rowMatches.push(checkMatch);
                }
                else {
                    break;
                }
            }
            for (var i = piece.column + 1; i < puzzleSize; i++) {
                var checkMatch = getPieceObject($('#' + piece.row + '-' + i));
                if (checkMatch.color === piece.color) {
                    rowMatches.push(checkMatch);
                }
                else {
                    break;
                }
            }
            for (var i = piece.row - 1; i >= 0; i--) {
                var checkMatch = getPieceObject($('#' + i + '-' + piece.column));
                if (checkMatch.color === piece.color) {
                    columnMatches.push(checkMatch);
                }
                else {
                    break;
                }
            }
            for (var i = piece.row + 1; i < puzzleSize; i++) {
                var checkMatch = getPieceObject($('#' + i + '-' + piece.column));
                if (checkMatch.color === piece.color) {
                    columnMatches.push(checkMatch);
                }
                else {
                    break;
                }
            }

            if (columnMatches.length > 2) {
                $.each(columnMatches, function (i) {
                    matchMade = true;
                    addMissingColumnPiece(this.row, this.column);
                    $('#' + this.row + '-' + this.column).remove();
                });
            }
            if (rowMatches.length > 2) {
                $.each(rowMatches, function (i) {
                    matchMade = true;
                    addMissingColumnPiece(this.row, this.column);
                    $('#' + this.row + '-' + this.column).remove();
                });
            }
            //if both matched, don't count original piece twice
            if (columnMatches.length > 2 && rowMatches.length > 2) {
                columnMissingPieces[piece.column].count--;
            }
        }

        function addMissingColumnPiece(row, column) {
            if (!columnMissingPieces[column]) {
                columnMissingPieces[column] = {
                    row: row,
                    count: 1
                };
            }
            else {
                if (columnMissingPieces[column].row < row) {
                    columnMissingPieces[column].row = row;
                }
                columnMissingPieces[column].count++;
            }
        }

        function checkForAllMatches(callback) {
            matchMade = false;
            $.each($('.puzzle-piece'), function (i) {
                checkForSpecificMatch(getPieceObject($(this)));
            });

            if (callback) {
                callback();
            }
        }

        function checkForAllMatchesAndCascade(callback) {
            checkForAllMatches(function () {
                if (matchMade) {
                    cascade(function () {
                        createAndDropPiece(function () {
                            checkForAllMatchesAndCascade();
                        });
                    });
                }
            });

            if (callback) {
                callback();
            }
        }

        $(document).mouseup(function () {
            if (!animating) {
                selectedPiece = undefined;
            }
        });

        puzzlePieces.mouseleave(function () {
            if (!animating) {
                selectedPiece = undefined;
            }
        });

        jQuery.fn.swapWith = function (to, callback) {

            if (animating) {
                return;
            }
            animating = true;
            thisPos = $(this).position();
            toPos = $(to).position();
            $.when(
                $(this).animate({
                    top: toPos.top,
                    left: toPos.left
                }, 300),
                $(to).animate({
                    top: thisPos.top,
                    left: thisPos.left
                }, 300)).done(function () {
                    tempID = $(this)[0].attr('id');
                    $(this)[0].attr('id', $(this)[1].attr('id'));
                    $(this)[1].attr('id', tempID);

                    if (callback) {
                        callback();
                    }
                });


        };

        function doPiecesTouch(piece1, piece2, pieceSize) {
            swappedPiece = piece2;

            var fromPos = piece1.position();
            var toPos = piece2.position();

            return (toPos.top === fromPos.top || toPos.left === fromPos.left);
        }

        function getPieceObject(piece) {

            if (piece.length === 0) {
                return {
                    row: 9,
                    column: 9,
                    color: "Xerox"
                };
            }
            return {
                row: parseInt(piece.attr('id').split("-")[0]),
                column: parseInt(piece.attr('id').split("-")[1]),
                color: piece.find('img').attr('id')
            };
        }
    })





