/*
 File: HW9.js
 91.461 Assignment 9: Implementing a bit of scrabble with Drag-and-Drop
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
freely copied or excerpted for educational purposes with credit to the
author. 

Description: The purpose of this assignment is to implement a line of scrabble
             using drag and drop.
Date created: 12/03/2016 */

//code from Jesse Heines
var ScrabbleTiles = [] ; //holds info concerning scrabble tiles


var SCRABBLE_IMAGE = { //used for scrabble images
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

$(function () {
    AddEventListeners(); //adding event listener
    SetupScrabble(); //setting up scrabble game
    SetupDragAndDrop(); //setting up drag and drop
    SetUpDictionary(); //setting up the dictonary
})

/**
* sets up the event listeners
*/
function AddEventListeners() {

    //event listeners for the buttons
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

/**
* Ajax requests text dictionary and adds it to dictionary lookup object
*/
function SetUpDictionary() {
    //code supplied by Jason Downing on piazza
    // Do a jQuery Ajax request for the text dictionary
    $.get( "https://raw.githubusercontent.com/Mello244688/Mello244688.github.io/master/HW9/dictionary/dict.txt", function( txt, status ) {

        if (status == "success") {
            // Get an array of all the words
            var words = txt.split( "\n" );
         
            // And add them as properties to the dictionary lookup
            // This will allow for fast lookups later
            for ( var i = 0; i < words.length; i++ ) {
                dict[ words[i] ] = true;
            } 
        }
    });
}

/**
* sets up drag and drop including events
*/
function SetupDragAndDrop() {
    $(".selector").draggable({
		delay: 100,
		containment: "body", //only draggable inside body
		revert: "invalid", //reverts if not a droppable space
        stack: ".selector", //keeps draggable on top of elements
        
        //drag event checks if you're dragging an already set blank tile off the board
        //then resets it back to a blank tile
        drag: function(event, ui) { 
            if ($(this).parent().attr('name') == "_" && $(this).parent().parent().attr('id') == 'board') {
                $(this).parent().removeAttr('name');
                $(this).attr('id', "_");
                $(this).attr('src', "Scrabble_Tiles/" + GetImage("_"));
            }
        }
    });
    
    $(".target").droppable({ //droppable event for the targets on board
        tolerance: "intersect" , //at least 50% of draggable needs to be on droppable in either direction
        drop : function(event, ui) { //drop event
			//detaches img from div and appends to new div
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo("#" + this.id);  
			$('#' + this.id).droppable("disable"); //disables droppable when tile is dropped on
			MakeTargetsDroppableIfChanged(); //resets targets on board that have no tiles and are no longer droppable
			LastLetterPlayed(ui.draggable.attr('id'), this); //displaying last letter played
			
            if(ui.draggable.attr('id') == "_") {
			   PromptForBlank(ui.draggable);
			}
        }
    });
    
    $('#rack').droppable({ //making rack droppable
        drop: function(event, ui) {
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo('#' + ui.draggable.attr('name')); //code from Barry Pitman on stackoverflow.
            MakeTargetsDroppableIfChanged();
        }
    });
}

/**
* Prompts the user what they want to use the blank tile for and changes the tile to the one requested 
*/ 
function PromptForBlank(tile) {

    do { //looping while user does not enter a valid response
        
        tileRequested = prompt("Enter a letter to use as the blank tile"); //prompting for blank tile
        
        if (tileRequested != null && tileRequested.length == 1 && tileRequested.match(/[a-zA-Z]+/g )) {
           tileRequested = tileRequested.toUpperCase();
           $(tile).parent().attr('name', "_"); //used for resetting tiles
           $(tile).attr('src', 'Scrabble_Tiles/' + GetImage(tileRequested.trim())); //setting image
           $(tile).attr('id', tileRequested); //changing id to the tileRequested
        } 
    } while (tileRequested == null || tileRequested.length > 1 || tileRequested.match(/[a-zA-Z]+/g ) == null);
	
}

/**
* Sets up ScrabbleTiles object and gets tles to add to the rack
*/
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

/**
* gets the image file that represents the tile
* @param key: character that represents the letter of the tile;
* @return: returns the image
*/
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

/**
* gets the tiles to add to the player rack
*/
function GetTiles() {
    
    for (var i = 1; i <= 7; i++) { //looping 7 times
        if ($("#rack_tile" + i).has('img').length == 0) { //if there isnt already a tile in place, add 1
            AddTileToRack("#rack_tile" + i); //adding tile
        }
    }
}

/**
* Adds the tile to the rack
* @param divTag: string representation of the rack tile div
*/
function AddTileToRack(divTag) {
    
    var tile = GetRandomTile(); //getting a random tile based on total remaining tiles
    var num = GetDigitFromString(divTag); //gets the digit in the string for rack_tileNum
    
    if (tile != null) {
        img = $("<img id='" + tile + "' class='selector' name='rack_tile" + num + "'>"); //creating img tag
        img.attr("src", "Scrabble_Tiles/" + GetImage(tile)); //adding img src
        img.appendTo($(divTag)); //appending to div
    }  
}

/** 
* gets the digits from a string 
* @return: returns a string representing numbers
*/
function GetDigitFromString(word) {
    return word.match(/\d+/);
}

/**
* gets a random tile based on total remaining tiles
* @return: returns a string/char representing the letter of tile
*/
function GetRandomTile() {
    
    var remTiles = GetNumRemainingTiles(); //remaining tiles
    
    if(remTiles == 0 && $("#rack div img").length == 0) { //if there are no more available tiles and none on the rack
        GameOver();
    }
    
    var tileNumber = Math.floor(Math.random() * remTiles) + 1; //random num between 1 and remTiles
    
    for(var key in ScrabbleTiles) {
        tileNumber = tileNumber - ScrabbleTiles[key].number_remaining;

        if(tileNumber <= 0 && key != null) {
            ScrabbleTiles[key].number_remaining -= 1; //subtract the tile used from number_remaining
            return key;
        }
    }
}

/**
* calculates the number of remaining tiles based on the total remaining tiles
* @return: returns an int representing the number of tiles remaining
*/
function GetNumRemainingTiles() {
    
    var tileCount = 0;
    
    for(var key in ScrabbleTiles) {
        tileCount += ScrabbleTiles[key].number_remaining;
    }

    return tileCount;
}

/**
* the submit clicked handler. calculates scores of valid words.
*/
function SubmitClickHandler() {
    
	var totalScore = +($('#totalScore').text());
    var word = GetWord();
    var wordScore = 0;
    
    if (!IsValidWord(word)) { //resets letters if invalid word
        ResetAllLetters();
        $('#wordScore').text(0);
    }
    else { //calculating all scores and updating the html
        wordScore = CalculateWordScore(); 
        $('#wordScore').text(wordScore);
		totalScore = +($('#totalScore').text());
		totalScore += wordScore;
		$('#totalScore').text(totalScore);
        $('#board img').remove(); //removing used tiles
        GetTiles(); //getting new tiles
        SetupDragAndDrop();
        MakeTargetsDroppableIfChanged(); //making targets droppable
        RemoveBlankTileName(); //removes name attribute of "_" if any
    }
}

/**
* Gets the word spelt on the board
* @return: returns string representing the word spelt on board
*/
function GetWord() {
    
    var word = "";
    
    for (var i = 1; i <= $('#board div').length; i++) { //looping through targets on board
        
        $('#target' + i).has('img').length ? word += $('#target' + i + ' img').attr("id") : word += " "; //if there is an image add the letter to the word else add white space
    }
    
    return word.trim();
}

/**
* checks the dictionary object for valid word
* @param word: string representing the word being validated
* @return: returns a bool, true if word is valid, else false
*/
function IsValidWord(word) {
     
    return dict[word] ? true : false; 
}

/**
* resets all the letters on the board. sends back to rack
*/
function ResetAllLetters() {
    
    for (var i = 1; i <= $('#board div').length; i++) { //loop through targets on board
        
        if ( $('#target' + i).has('img').length) {
			
			if ($('#target' + i).attr('name') == "_") { //checking for blank letter
				$('#target' + i).removeAttr('name'); //removing name attr "_"
				$('#target' + i).children('img').attr('id', "_"); //setting img id to "_"
				$('#target' + i).children('img').attr('src', "Scrabble_Tiles/" + GetImage("_")); //setting src to blank tile
			}
            ResetLetter($('#target' + i +' img')); //reset letter
            $('#target' + i).droppable('enable'); //make sure droppable is enabled
        }
    }
}

/**
* detaches a letter from the target div and puts it back on the board
*/
function ResetLetter(img) {
    
    var rackLetterId = "#" + img.attr("name");
    img.detach().css({top: 0,left: 0}).appendTo(rackLetterId);
}

/**
* checks if targets have had droppable disabled and re-enables it
*/
function MakeTargetsDroppableIfChanged () {
    
    var disabled = "disabled";
    
    for (var i = 1; i <= $('#board div').length; i++) {
        
        if ($('#target' + i).attr("class").search(disabled) > 0 && $('#target' + i).has('img').length == 0) {
            $('#target' + i).droppable('enable');
        }
    }
}

/**
* calculates the word score with bonuses
* @return: integer representing the word score
*/
function CalculateWordScore() {
    
    var id;
    var wordScore = 0;
    var isDoubleWordScore = false;
    
    $('#board div img').each(function(index) { //loops through each tile on board
        id = this.id;
        
        if ($(this).parent().attr('id') == "target2") { //target2 is a double word score
            wordScore += ScrabbleTiles[id].value;
            isDoubleWordScore = true;
        }
        else if ($(this).parent().attr('id') == "target6") { //target6 is a triple letter score
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

/**
* starts a new game, resetting everything
*/
function NewGame() {
    
    if ($('#gameOver')) {
        $('#gameOver').remove();
    }
    
    $('#submitButton').prop("disabled", false); //disabling submit button
    $('#resetButton').prop("disabled", false); //disabling reset button
    
    //resetting fields in html
	$('#letterPlayed').text('N/A');
	$('#wordScore').text(0);
	$('#totalScore').text(0);
    
    for (var i = 1; i <= $('#board div').length; i++) { //removing tiles from board
        $('#board div img').remove();
    }
    
    for (var i = 1; i <= 7; i++) { //removing tiles from rack
        $('#rack div img').remove();
    }
    
    SetupScrabble(); //setting up scrabble
    SetupDragAndDrop(); //setting up drag and drop
    MakeTargetsDroppableIfChanged(); //re-enabling droppable targets
}

/**
* Game over when there are no tiles left
*/
function GameOver() {
    
    $('body').prepend("<p id='gameOver'><b>GAME OVER!<b><p>");
    $('#submitButton').prop("disabled", true); //disabling submit button
    $('#resetButton').prop("disabled", true); //disabling reset button
}

/**
* displays the letter played and where
* @param letter: string/char representation of the letter tile
* @param target: html object representing target div
*/
function LastLetterPlayed(letter, target) {
    
    if(target != null) {
        $('#letterPlayed').text(letter + " was placed on " + target.id);
    } 
    else {
        $('#letterPlayed').text("N/A");
    }
    
}

/**
* removes name attributes from board target divs used to save blank tiles
*/
function RemoveBlankTileName() {
 
    $('#board div').each(function(index) {//looping through each div in #board div
        if ($(this).attr('name')) { //checking if div has a name attribute
            $(this).removeAttr('name'); //removing attribute from div
        }
    });
}