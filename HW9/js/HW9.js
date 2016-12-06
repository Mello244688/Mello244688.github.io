/*
 File: HW9.js
 91.461 Assignment 8: Implementing a bit of scrabble with Drag-and-Drop
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
freely copied or excerpted for educational purposes with credit to the
author. 

Description: The purpose of this assignment is to implement a line of scrabble
             using drag and drop.
Date created: 12/03/2016 */

//code from Jesse Heines
var ScrabbleTiles = [] ;


var SCRABBLE_IMAGE = {
    A : "Scrabble_Tile_A.jpg",
    B : "Scrabble_Tile_B.jpg",
    C : "Scrabble_Tile_C.jpg",
    D : "Scrabble_Tile_D.jpg",
    E : "Scrabble_Tile_E.jpg",
    F : "Scrabble_Tile_F.jpg",
    G : "Scrabble_Tile_G.jpg",
    H : "Scrabble_Tile_H.jpg",
    I : "Scrabble_Tile_I.jpg",
    J : "Scrabble_Tile_J.jpg",
    K : "Scrabble_Tile_K.jpg",
    L : "Scrabble_Tile_L.jpg",
    M : "Scrabble_Tile_M.jpg",
    N : "Scrabble_Tile_N.jpg",
    O : "Scrabble_Tile_O.jpg",
    P : "Scrabble_Tile_P.jpg",
    Q : "Scrabble_Tile_Q.jpg",
    R : "Scrabble_Tile_R.jpg",
    S : "Scrabble_Tile_S.jpg",
    T : "Scrabble_Tile_T.jpg",
    U : "Scrabble_Tile_U.jpg",
    V : "Scrabble_Tile_V.jpg",
    W : "Scrabble_Tile_W.jpg",
    X : "Scrabble_Tile_X.jpg",
    Y : "Scrabble_Tile_Y.jpg",
    Z : "Scrabble_Tile_Z.jpg",
    BLANK : "Scrabble_Tile_Blank.jpg"
};

// The dictionary lookup object
var dict = {};

//the scores
var wordScore = 0;
var totalScore = 0;

$(function () {
    AddEventListeners();
    SetupScrabble();
    SetupDragAndDrop();
    SetUpDictionary();
})

function AddEventListeners() {

    $("#submitButton").click(function() {
        SubmitClickHandler();
    });
    
    $("#resetButton").click(function () {
        ResetAllLetters();
    });
    
    $('#newGame').click(function() {
        NewGame();
    });
}

function SetUpDictionary() {
    //code supplied by Jason Downing on piazza
    // Do a jQuery Ajax request for the text dictionary
    $.get( "https://raw.githubusercontent.com/Mello244688/Mello244688.github.io/master/HW9/dictionary/dict.txt", function( txt, status ) {
        // Get an array of all the words
        var words = txt.split( "\n" );
     
        // And add them as properties to the dictionary lookup
        // This will allow for fast lookups later
        for ( var i = 0; i < words.length; i++ ) {
            dict[ words[i] ] = true;
        }
    });
}

function SetupDragAndDrop() {
    $(".selector").draggable({
        delay: 100,
        containment: "body",
        revert: "invalid"
    });
    
    $(".target").droppable({
        tolerance: "intersect" ,
        drop : function(event, ui) {
           $(ui.draggable).detach().css({top: 0,left: 0}).appendTo("#" + this.id); //code from Barry Pitman on stackoverflow
           $('#' + this.id).droppable("disable");
           MakeTargetsDroppableIfChanged();
           LastLetterPlayed(ui.draggable.attr('id'), this);

           if(ui.draggable.attr('id') == "_") {
               PromptForBlank();
           }
        }
    });  
}

function PromptForBlank() {
   var tile = prompt("Enter a letter to use as the blank tile");
   alert(tile);
}

function SetupScrabble() {
    //code from Jesse Heines
    ScrabbleTiles["A"] = { "value" : 1,  "original_distribution" : 9,  "number_remaining" : 9  } ;
    ScrabbleTiles["B"] = { "value" : 3,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["C"] = { "value" : 3,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["D"] = { "value" : 2,  "original_distribution" : 4,  "number_remaining" : 4  } ;
    ScrabbleTiles["E"] = { "value" : 1,  "original_distribution" : 12, "number_remaining" : 12 } ;
    ScrabbleTiles["F"] = { "value" : 4,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["G"] = { "value" : 2,  "original_distribution" : 3,  "number_remaining" : 3  } ;
    ScrabbleTiles["H"] = { "value" : 4,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["I"] = { "value" : 1,  "original_distribution" : 9,  "number_remaining" : 9  } ;
    ScrabbleTiles["J"] = { "value" : 8,  "original_distribution" : 1,  "number_remaining" : 1  } ;
    ScrabbleTiles["K"] = { "value" : 5,  "original_distribution" : 1,  "number_remaining" : 1  } ;
    ScrabbleTiles["L"] = { "value" : 1,  "original_distribution" : 4,  "number_remaining" : 4  } ;
    ScrabbleTiles["M"] = { "value" : 3,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["N"] = { "value" : 1,  "original_distribution" : 6,  "number_remaining" : 6  } ;
    ScrabbleTiles["O"] = { "value" : 1,  "original_distribution" : 8,  "number_remaining" : 8  } ;
    ScrabbleTiles["P"] = { "value" : 3,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["Q"] = { "value" : 10, "original_distribution" : 1,  "number_remaining" : 1  } ;
    ScrabbleTiles["R"] = { "value" : 1,  "original_distribution" : 6,  "number_remaining" : 6  } ;
    ScrabbleTiles["S"] = { "value" : 1,  "original_distribution" : 4,  "number_remaining" : 4  } ;
    ScrabbleTiles["T"] = { "value" : 1,  "original_distribution" : 6,  "number_remaining" : 6  } ;
    ScrabbleTiles["U"] = { "value" : 1,  "original_distribution" : 4,  "number_remaining" : 4  } ;
    ScrabbleTiles["V"] = { "value" : 4,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["W"] = { "value" : 4,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["X"] = { "value" : 8,  "original_distribution" : 1,  "number_remaining" : 1  } ;
    ScrabbleTiles["Y"] = { "value" : 4,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    ScrabbleTiles["Z"] = { "value" : 10, "original_distribution" : 1,  "number_remaining" : 1  } ;
    ScrabbleTiles["_"] = { "value" : 0,  "original_distribution" : 2,  "number_remaining" : 2  } ;
    
    GetTiles();
    
}

function GetImage(key) {

    if (key == "A") {return SCRABBLE_IMAGE.A}
    else if (key == "B") { return SCRABBLE_IMAGE.B; }
    else if (key == "C") { return SCRABBLE_IMAGE.C; }
    else if (key == "D") { return SCRABBLE_IMAGE.D; }
    else if (key == "E") { return SCRABBLE_IMAGE.E; }
    else if (key == "F") { return SCRABBLE_IMAGE.F; }
    else if (key == "G") { return SCRABBLE_IMAGE.G; }
    else if (key == "H") { return SCRABBLE_IMAGE.H; }
    else if (key == "I") { return SCRABBLE_IMAGE.I; }
    else if (key == "J") { return SCRABBLE_IMAGE.J; }
    else if (key == "K") { return SCRABBLE_IMAGE.K; }
    else if (key == "L") { return SCRABBLE_IMAGE.L; }
    else if (key == "M") { return SCRABBLE_IMAGE.M; }
    else if (key == "N") { return SCRABBLE_IMAGE.N; }
    else if (key == "O") { return SCRABBLE_IMAGE.O; }
    else if (key == "P") { return SCRABBLE_IMAGE.P; }
    else if (key == "Q") { return SCRABBLE_IMAGE.Q; }
    else if (key == "R") { return SCRABBLE_IMAGE.R; }
    else if (key == "S") { return SCRABBLE_IMAGE.S; }
    else if (key == "T") { return SCRABBLE_IMAGE.T; }
    else if (key == "U") { return SCRABBLE_IMAGE.U; }
    else if (key == "V") { return SCRABBLE_IMAGE.V; }
    else if (key == "W") { return SCRABBLE_IMAGE.W; }
    else if (key == "X") { return SCRABBLE_IMAGE.X; }
    else if (key == "Y") { return SCRABBLE_IMAGE.Y; }
    else if (key == "Z") { return SCRABBLE_IMAGE.Z; }
    else if (key == "_") { return SCRABBLE_IMAGE.BLANK; }
}

function GetTiles() {
    
    for (var i = 1; i <= 7; i++) {
        if ($("#rack_tile" + i).has('img').length == 0) { 
            AddTileToRack("#rack_tile" + i);
        }
    }
}

function AddTileToRack(divTag) {
    
    var tile = GetRandomTile();
    var num = GetDigitFromString(divTag);
    
    if (tile != null) {
        img = $("<img id='" + tile + "' class='selector' name='rack_tile" + num + "'>");
        img.attr("src", "Scrabble_Tiles/" + GetImage(tile));
        img.appendTo($(divTag));
    }  
}

function GetDigitFromString(word) {
    return word.match(/\d+/);
}

function GetRandomTile() {
    
    var remTiles = GetNumRemainingTiles(); //remaining tiles
    
    if(remTiles == 0 && $("board")) {
        GameOver();
    }
    
    var tileNumber = Math.floor(Math.random() * remTiles) + 1; //random num between 1 and remTiles
    
    for(var key in ScrabbleTiles) {
        tileNumber = tileNumber - ScrabbleTiles[key].number_remaining;

        if(tileNumber <= 0 && key != null) {
            ScrabbleTiles[key].number_remaining - 1;
            return key;
        }
    }
}

function GetNumRemainingTiles() {
    
    var tileCount = 0;
    
    for(var key in ScrabbleTiles) {
        tileCount += ScrabbleTiles[key].number_remaining;
    }
    
    return tileCount;
}

function SubmitClickHandler() {
    
    var word = GetWord();
    var wordScore = 0;
    
    alert('Your word is: ' + word + " Valid: " + IsValidWord(word));
    if (!IsValidWord(word)) {
        ResetAllLetters();
    }
    else {
        wordScore = CalculateWordScore();
        $('#wordScore').text(wordScore);
    }
}

function GetWord() {
    
    var word = "";
    
    for (var i = 1; i <= $('#board div').length; i++) {
        
        $('#target' + i).has('img').length ? word += $('#target' + i + ' img').attr("id") : word += " ";
    }
    
    return word.trim();
}

function IsValidWord(word) {
     
    return dict[word] ? true : false;
}

function ResetAllLetters() {
    
    for (var i = 1; i <= $('#board div').length; i++) {
        
        if ( $('#target' + i).has('img').length) {
            ResetLetter($('#target' + i +' img'));
            $('#target' + i).droppable('enable');
        }
    }
}

function ResetLetter(img) {
    
    var rackLetterId = "#" + img.attr("name");
    img.detach().css({top: 0,left: 0}).appendTo(rackLetterId);
}

function MakeTargetsDroppableIfChanged () {
    
    var disabled = "disabled";
    
    for (var i = 1; i <= $('#board div').length; i++) {
        
        if ($('#target' + i).attr("class").search(disabled) > 0 && $('#target' + i).has('img').length == 0) {
            $('#target' + i).droppable('enable');
        }
    }
}

function CalculateWordScore() {
    
    var totalScore = +($('#totalScore').text());
    var id;
    var wordScore = 0;
    var isDoubleWordScore = false;
    
    $('#board div img').each(function(index) {
        id = this.id;
        
        if ($(this).parent().attr('id') == "target2") {
            wordScore += ScrabbleTiles[id].value;
            isDoubleWordScore = true;
        }
        else if ($(this).parent().attr('id') == "target6") {
            wordScore += ScrabbleTiles[id].value * 3;
        }
        else {
            wordScore += ScrabbleTiles[id].value;
        }
    });
        
    if (isDoubleWordScore) {
        wordScore = wordScore * 2;
    }
    
    return wordScore;
}

function NewGame() {
    
    if ($('#gameOver')) {
        $('#gameOver').remove();
    }
    
    $('#submitButton').prop("disabled", false); //disabling submit button
    $('#resetButton').prop("disabled", false); //disabling reset button
    
    for (var i = 1; i <= $('#board div').length; i++) {
        $('#board div img').remove();
    }
    
    for (var i = 1; i <= 7; i++) {
        $('#rack div img').remove();
    }
    
    SetupScrabble();
    SetupDragAndDrop();
    MakeTargetsDroppableIfChanged();
}

function GameOver() {
    
    $('body').prepend("<p id='gameOver'><b>GAME OVER!<b><p>");
    $('#submitButton').prop("disabled", true); //disabling submit button
    $('#resetButton').prop("disabled", true); //disabling reset button
}

function LastLetterPlayed(letter, target) {
    
    if(target != null) {
        $('#letterPlayed').text(letter + " was placed on " + target.id);
    } 
    else {
        $('#letterPlayed').text("N/A");
    }
    
}