/* File: /js/HW6.js
 91.461 Assignment 6: Creating an Interactive Dynamic Table
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author. 

 Description: The is the JabaScript for a single page web app that dynamically 
                creates a multiplication table based on form input from the user
 Date created: 10/24/2016 */

 /**
 * Retrieves user input to create table. Fires when the submit button is clicked. 
 */
function onSubmitClicked() {
    
    var maxCells = 100000; //the max cells in a table without prompting warning
    var tableId = "myTable"; //the id for the dynamically created table
    
    //getting the user input values
    var mCandStart = document.getElementById("num1").value;
    var mCandEnd = document.getElementById("num2").value;
    var mPlierStart = document.getElementById("num3").value;
    var mPlierEnd = document.getElementById("num4").value;
    
    var multiplicand = [];//array values for the mutiplicand range
    var multiplier = [];//array values for the multiplier range
    
    //populating arrays with the multiplicand and multplier number ranges
    multiplicand = GetNumberRange(mCandStart, mCandEnd);
    multiplier = GetNumberRange(mPlierStart, mPlierEnd);
    
    //warning about creating overly large tables. gives the option to abort
    if (multiplicand.length * multiplier.length > maxCells) {
        if (confirm("WARNING: You are trying to create a table with " 
        + multiplicand.length * multiplier.length 
        + " cells. This is not Recommended\n\nPress OK to contine\nPress CANCEL to abort" ) == false) {
            exit(1);
        }
    }
    
    //setting inputs to zero if they were not provided
    SetDefaultInputs(multiplicand, multiplier);
    
    //deleting table if there is one
    DeleteTable(tableId);
    
    //creating table from the multiplicand and multiplier ranges
    CreateTable(multiplicand, multiplier, tableId);
    
    //adding a caption to a table
    AddCaption(tableId);

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
    tableDiv.style.minWidth = "540px";
    tableDiv.style.maxHeight = "400px";
    tableDiv.style.padding = "25px";
    tableDiv.style.border = "2px solid #3377ff";
    tableDiv.style.borderRadius = "8px";
    tableDiv.style.backgroundColor = "#FFFFE6";
    tableDiv.style.marginTop = "15px";
    tableDiv.style.overflow = "auto";
    
    //setting table width based on length of multiplier
    if (multiplier.length < 15) {
        tableDiv.style.width = "50%";
    }
    else if (multiplier.length < 30) {
        tableDiv.style.width = "65%";
    }
    else if (multiplier.length < 40) {
        tableDiv.style.width = "80%";
    }
    else {
        tableDiv.style.width = "95%";
    }
    
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
    var bgColor = "#4CAF50"; //used for resetting the color of submit button
    
    //if there is a table, delete it
    if(table) {
        DeleteTable(table.id);
    }
    
    //resetting borders 
    document.getElementById('num1').style.border = emptyString; 
    document.getElementById('num2').style.border = emptyString;
    document.getElementById('num3').style.border = emptyString;
    document.getElementById('num4').style.border = emptyString;

    //enabling submit button
    document.getElementById('submitButton').removeAttribute("disabled");
    
    //adding default bgcolor to submitButton
    if (submitButton.style.backgroundColor != bgColor) {
        submitButton.style.backgroundColor = "#4CAF50";
    }
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
* text input event handler that validates user input
* @param textBox: an html element object that represent user text input
*/
function validateInput(textBox) {
    var isValid = true; //used to check validity of current textbox
    
    //retrieves all input values of text and puts them into an array
    var inputs = document.querySelectorAll('#NumberForm input[type=text]');
    var canSubmit = true; //whether or not the submit button can be pressed
    var emptyString = ""; //compared to empty strings
    var strCursorPointer = "pointer"; //used to set cursor to pointer
    var strCursorNot = "not-allowed"; //used to set cursot to not-allowed
    var value = +(textBox.value); //retrieving textbox value as an int
    
    //checking that the text value is a number for current textbox
    if (isNaN(value)) {
        isValid = false;
    }
    else {
        isValid = true;
    }
    //validating for all user input
    for (var i = 0; i < inputs.length; i++) {
        if (isNaN(inputs[i].value)) {
            canSubmit = false;
        }
    }
    
    //getting the submit button
    var submitButton = document.getElementById('submitButton');
    
     //all text inputs are valid. enable submit button and remove red border 
     //from textbox
    if (canSubmit && isValid) {
        submitButton.removeAttribute("disabled");
        textBox.style.border = "";
        if (submitButton.style.backgroundColor != "#4CAF50") {
            submitButton.style.backgroundColor = "#4CAF50";
        }
        if (submitButton.style.cursor != strCursorPointer) {
            submitButton.style.cursor = strCursorPointer;
        }
        
        
        
    }
    //the current textbox input is valid but not others. remove red border
    //from textbox. disable the submit button
    else if (isValid) { 
        textBox.style.border = "";
        submitButton.setAttribute("disabled", "disabled");
        submitButton.style.backgroundColor = "#d9d9d9";
        submitButton.style.cursor = strCursorNot;
    }
    //current textbox input is invalid. disable the submit button and set a 
    //red border to current text box
    else { 
        submitButton.setAttribute("disabled", "disabled");
        textBox.style.border = "2px solid red";
        submitButton.style.backgroundColor = "#d9d9d9";
        submitButton.style.cursor = strCursorNot;
    }
}

/**
* sets the user input arrays to zero
* @param multiplicand: array of ints representing the vertical left column of table
* @param multiplier: array of ints representing the horizontal top row of table
*/
function SetDefaultInputs(multiplicand, multiplier) {
    //setting all text inputs to zero if they were not provided
    for (var i = 0; i < multiplicand.length; i++) {
        if (multiplicand[i].length < 1) {
            multiplicand[i] = 0;
        }
    }
    
    for (var i = 0; i < multiplier.length; i++) {
    
        if (multiplier[i].length < 1) {
            multiplier[i] = 0;
        }
    }
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

/**
* event handler that sets the background color of the submit button when not hovering.
* this event only fires while the submit button is enabled
* @param submitButton: html element object representing the submit button
*/
function SetBgColor(submitButton) {
    submitButton.style.backgroundColor = "#4CAF50";
    
}

/**
* event handler that sets the background color of the submit button on hover.
* this event only fires while the submit button is enabled
* @param submitButton: html element object representing the submit button
*/
function SetHoverColor(submitButton) {
    submitButton.style.backgroundColor = "#45a049";
    
}