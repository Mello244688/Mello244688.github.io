/* File: /js/HW6.js
 91.461 Assignment 6: Creating an Interactive Dynamic Table
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author. 

 Description: The is the JabaScript for a single page web app that dynamically 
                creates a multiplication table based on form input from the user
 Date created: 10/24/2016 */

 //adding event listeners and setting up validation when document is ready
 $(function() {
     addEventListeners();
     setupValidation();
 });
 
 /**
 * Retrieves user input to create table. Fires when the submit button is clicked. 
 */
function onSubmitClicked() {
    var tableId = "myTable"; //the id for the dynamically created table
    
    //getting the user input values
    var mCandStart = document.getElementById("MultiplicandStart").value;
    var mCandEnd = document.getElementById("MultiplicandEnd").value;
    var mPlierStart = document.getElementById("MultiplierStart").value;
    var mPlierEnd = document.getElementById("MultiplierEnd").value;
    
    var multiplicand = [];//array values for the mutiplicand range
    var multiplier = [];//array values for the multiplier range
    
    //populating arrays with the multiplicand and multplier number ranges
    multiplicand = GetNumberRange(mCandStart, mCandEnd);
    multiplier = GetNumberRange(mPlierStart, mPlierEnd);
    
    //deleting table if there is one
    DeleteTable(tableId);
    
    //creating table from the multiplicand and multiplier ranges
    CreateTable(multiplicand, multiplier, tableId);
    
    //adding a caption to a table
    AddCaption(tableId);
}

/**
* sets up all the event listeners
*/
function addEventListeners() {
    var submitButton = document.getElementById("submitButton"); //button to submit form info
    var resetButton = document.getElementById("resetButton"); //reset button for form
    var myTableForm = document.getElementById("myTableForm"); //form
    
    //reset listener for all major browsers, except IE 8 and earlier
    if (resetButton.addEventListener) {
        resetButton.addEventListener("click", function() {
            onResetClicked(document.getElementById("myTable"));
        }, false);
    }
    //reset listener for IE 8 and earlier versions
    else if (resetButton.attachEvent) {
        resetButton.attachEvent("click", function() {
            onResetClicked(document.getElementById("myTable"));
        }, false);
    }
    //submit listener for all major browsers, except IE 8 and ealier
    if (myTableForm.addEventListener) {
        myTableForm.addEventListener("submit", function(e) {
            e.preventDefault();
        }, false);
    }
    //submit listener for IE 8 and earlier versions
    else if (myTableForm.attachEvent) {
        myTableForm.attachEvent("submit", function(e) {
            e.preventDefault();
        }, false);
    }
    
}
/**
* sets up input validation using jquery form validator
*/
function setupValidation() {
    $.validate({
        modules : 'html5', //used for number validation
        //validateOnBlur : false, //so the validator only validates once the submit button is clicked
        addSuggestions : false, //so the validator does not search for suggestions
        showHelpOnFocus : false, //so the validator does not check for help messages
        errorMessagePosition : 'inline', //default message position is top
        onSuccess : function($form) {
            onSubmitClicked();
        }
    });
}

/**
* dynamically creates table in body of html based on 2 user ranges
* @param multiplicand: array of ints representing the vertical left column of table
* @param multiplier: array of ints representing the horizontal top row of table
* @param id: string representation of the table ID
*/
function CreateTable(multiplicand, multiplier, id) {
    var body = document.body; //html body
    var table = document.createElement("table"); //creating empty table
    var empty = ""; //used to compare empty strings
    var tableDiv = document.createElement('div'); //creating div for table
    
    //formatting the table
    table.setAttribute('id', id);
    table.style.width = "95%";
    table.style.border = "1px solid black";
    table.style.borderRadius = "8px";
    table.style.margin = "0 auto";
    
    //formatting the div for the table
    tableDiv.id = 'tableDiv'; 
    tableDiv.style.display = "inline-block";
    tableDiv.style.position = "absolute";
    tableDiv.style.top = "10px";
    tableDiv.style.minWidth = "340px";
    tableDiv.style.maxHeight = "90%";
    tableDiv.style.padding = "25px";
    tableDiv.style.border = "2px solid #3377ff";
    tableDiv.style.borderRadius = "8px";
    tableDiv.style.backgroundColor = "#FFFFE6";
    tableDiv.style.overflow = "auto";
    tableDiv.style.width = "65%";
    
    //populating table
    for (var i = 0; i < multiplicand.length + 1; i++) {
        var row = document.createElement("TR"); //creating table row
        var cell; //used for creating table cells
        var cellText; //text that goes in cell
        
        for (var j = 0; j < multiplier.length + 1; j++) {
            if (i == 0) { //In the first row. create table headings
                cell = document.createElement("TH");
                
                if (j == 0) { //should be an empty heading at 0, 0
                    cellText = document.createTextNode(empty);
                }
                else { //creating row headings
                    cellText = document.createTextNode(multiplier[j - 1]);
                }
            }
            else { //not in first row
                if (j == 0) { //first element in row should be heading
                    cell = document.createElement("TH");
                    cellText = document.createTextNode(multiplicand[i - 1]);
                }
                else { //not first element in row
                    cell = document.createElement("TD");
                    cellText = document.createTextNode(multiplicand[i - 1] * multiplier[j - 1]);
                }
            }
            cell.appendChild(cellText); //adding text to cell;
            
            //formatting table cells
            cell.style.border = "1px solid black";
            cell.style.borderRadius = "2px";
            cell.style.textAlign = "center";
            
            //increasing font size of all table headings
            if (i == 0 || j == 0) {
                cell.style.fontSize = "1.2em";
            }
            
            row.appendChild(cell); //adding cell to row
        }
        if (i % 2 == 1) { //setting odd rows bgcolor to gray
            row.style.backgroundColor = "#dddddd";
        }
        else {
            row.style.backgroundColor = "white";
        }
        table.appendChild(row); //adding row to table
    }
    tableDiv.appendChild(table); //adding table to div
    body.appendChild(tableDiv); //adding div to html body
}

/**
* deletes a table given the id. If there is a specific div called tableDiv, it\
* will also be deleted
* @param tableId: string representing the id of the table
*/
function DeleteTable(tableId) {
    var table = document.getElementById(tableId); //getting the table
    var div = document.getElementById('tableDiv'); //getting the tables div
    //deleting table then div if they are not null
    if (table != null) {
        table.parentNode.removeChild(table);        
    }
    if (div != null) {
        div.parentNode.removeChild(div);
    }
}

/**
* resets everything on the page to defaults. deletes table if there is one.
* @param table: An html element object that represents a table
*/
function onResetClicked(table) {
    var emptyString = ""; //compare to empty strings
    var strCursorPointer = "pointer"; //for setting the cursor to pointer
    var strCursorNot = "not-allowed"; //for checking if cursor is set to not-allowed
    var submitButton = document.getElementById('submitButton'); //getting submit button
    
    //if there is a table, delete it
    if(table) {
        DeleteTable(table.id);
    }
    
    //resetting borders 
    document.getElementById('MultiplicandStart').style.border = emptyString; 
    document.getElementById('MultiplicandEnd').style.border = emptyString;
    document.getElementById('MultiplierStart').style.border = emptyString;
    document.getElementById('MultiplierEnd').style.border = emptyString;

    //enabling submit button
    document.getElementById('submitButton').removeAttribute("disabled");
    
    //resetting the cursor to pointer
    if (submitButton.style.cursor == strCursorNot) {
        submitButton.style.cursor = strCursorPointer;
    }
}

/**
* Adds a caption to a table
* @param tableId: a string representation of a table id
*/
function AddCaption(tableId) {
    var tableCaption = document.getElementById(tableId).createCaption();
    tableCaption.innerHTML = "<b>Multiplication Table</b>";
    
    tableCaption.style.color = "#3377ff";
    tableCaption.style.paddingBottom = "10px";
}

/**
* returns a range of numbers based on a starting and ending range 
* @param numStart: int representing the starting range
* @param numEnd: int representing the ending range
* @return: array of ints representing the number range
*/
function GetNumberRange(numStart, numEnd) {
        var numRange = []; //range of numbers
        numStart = +numStart; //converting to int
        numEnd = +numEnd; //converting to int
        
        //populating the numRange array
        if (numStart < numEnd) {
            
            for (var i = numStart; i <= numEnd; i++) {
                numRange.push(i);
            }   
        }
        else { //larger starting number
            for (var i = numStart; i >= numEnd; i--) {
                numRange.push(i);
            }
        }
        return numRange;
}