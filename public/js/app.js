// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])


  .run(function ($ionicPlatform) {
    var board = $("#puzzle-board");
    var puzzlePieces = $("#puzzle-board-pieces");
    var selectedPiece;
    var animating = false;
    var pieceSize = 56;

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
        url: 'http://localhost:3000/createPuzzle',
        type: 'GET',
        data: '', // or $('#myform').serializeArray()
        success: function (data) { loadPuzzle(data) }
      });
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
      }, 300),
        $(to).animate({
          top: thisPos.top,
          left: thisPos.left
        }, 300)).done(function () {
          animating = false;
        });


    };

    function loadPuzzle(colors) {      
      $.each(JSON.parse(colors), function (i) {
        $.each(this, function (j) {
          var piece = document.createElement("div");
          var img = document.createElement("img");
          img.draggable = false;
          piece.draggable = false;
          img.src = "img/" + this.Color + ".png";
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
            if (selectedPiece && doPiecesTouch(selectedPiece, $(this), pieceSize)) {
              selectedPiece.swapWith($(this));
              selectedPiece = undefined;
            }
          });
        })
      });

    }

  })

  function doPiecesTouch(piece1, piece2, pieceSize){
    var fromPos = piece1.position();
    var toPos = piece2.position();
    
    return (toPos.top === fromPos.top || toPos.left === fromPos.left);
  }





