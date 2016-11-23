/* File: /js/HW8.js
 91.461 Assignment 8: Using the jQuery Slider and Tab widgets
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author. 

 Description: The purpose of this assignment is to implement tabs and sliders in
              the previous HW7.
 Date created: 11/20/2016 */

 //adding event listeners and setting up validation when document is ready
 var validator; //validator
 $(function() {
     addEventListeners();
     setupValidation();
     setupSliders();
	 setupTabs();
 });
 
 /**
 * Retrieves user input to create table. Fires when the submit button is clicked. 
 */
function onSubmitClicked() {
	var tabCount = $('#tabs ul li').length + 1;
    var tableId = "myTable" + tabCount; //the id for the dynamically created table
    
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
    //DeleteTable(tableId);
    
    //creating table from the multiplicand and multiplier ranges
    var TableDiv = CreateTable(multiplicand, multiplier, tableId);
	
	addTabAndTable(TableDiv);
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
    
    //when key is released in input boxes, update the slider with the value
    $('#MultiplicandStart').change(function() {
        $("#slider1").slider("value", this.value);
        if (inputsHaveValues()) {
            $("#myTableForm").submit();
        }
    });
    
    $('#MultiplicandEnd').change(function() {
        $("#slider2").slider("value", this.value);
        if (inputsHaveValues()) {
            $("#myTableForm").submit();
        }
    });
    
    $('#MultiplierStart').change(function() {
        $("#slider3").slider("value", this.value);
        if (inputsHaveValues()) {
            $("#myTableForm").submit();
        }
    });
    
    $('#MultiplierEnd').change(function() {
        $("#slider4").slider("value", this.value);
        if (inputsHaveValues()) {
            $("#myTableForm").submit();
        }
    });
    
    $('#deleteTabsButton').on("click", function() {
        var tabCount = $('#tabs ul li').length;
        if (tabCount > 1) {
            TabDeletionForm();
        }
    });
    
    $('#NumberForm').on("click", '#submitDeletionForm', function(e) {
        e.preventDefault();
        DeleteSelectedTabs();
    });
    
    //removes selected tab
    $('#tabList').on("click", ".ui-closable-tab", function() {
        var tabDiv=$(this).closest(".ui-tabs").attr("id");
        var tabId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + tabId ).remove();
        $("#"+tabDiv).tabs("refresh");
    });
}
/**
* sets up input validation using jquery form validator
*/
function setupValidation() {
    //custom validation rule for pos and neg integers
    jQuery.validator.addMethod("nums", function(value, element) {
        return /-?[0-9]{0,10}/.test(value) 
                    & $.isNumeric(value) & value >= -100 & value <= 100;
    }, "Not a valid number. Enter a Number");
    
    validator = $("#myTableForm").validate({
        submitHandler: function(form) {
            onSubmitClicked();
        },
        rules: { //setting validation rules
            input1: {
                required: true,
                nums: true
            },
            input2: {
                required: true,
                nums: true
            },
            input3: {
                nums: true,
                required: true
            },
            input4: {
                required: true,
                nums: true
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "MultiplicandStart") {
                error.appendTo('#error1');
            }
            else if (element.attr("id") == "MultiplicandEnd") {
                error.appendTo('#error2');
            }
            else if (element.attr("id") == "MultiplierStart") {
                error.appendTo('#error3');
            }
            else if (element.attr("id") == "MultiplierEnd") {
                error.appendTo('#error4');
            }
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
	var tabCount = $('#tabs ul li').length + 1;
    
    //formatting the table
    table.setAttribute('id', id);
    table.style.width = "95%";
    table.style.border = "1px solid black";
    table.style.borderRadius = "8px";
    table.style.margin = "0 auto";
    
    //formatting the div for the table
    tableDiv.id = 'tableDiv' + tabCount; 
    tableDiv.style.display = "inline-block";
    tableDiv.style.minWidth = "340px";
    tableDiv.style.maxHeight = "80%";
    tableDiv.style.padding = "25px";
    tableDiv.style.border = "2px solid #3377ff";
    tableDiv.style.borderRadius = "8px";
    tableDiv.style.backgroundColor = "#FFFFE6";
    tableDiv.style.overflow = "auto";
    tableDiv.style.width = "90%";
    tableDiv.style.marginLeft = "auto";
    tableDiv.style.marginRight = "auto";
    
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
	//adding a caption to a table
    AddCaption(table);
	
    tableDiv.appendChild(table); //adding table to div
    //body.appendChild(tableDiv); //adding div to html body
	
	return tableDiv;
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
    var tabCount = $('#tabs ul li').length + 1;
    
    if (validator) {
        validator.resetForm();
    }
    
    $('#tabs').tabs('destroy'); //destroying all tabs
    $('#tabList li:not(:first-child)').remove(); //removing all tab li elements except the first
    $('table').parent().parent().remove(); //removing the tab divs and everything inside
    setupTabs();
    
    //reset slider positions
    $("#slider1").slider("value", 0);
    $("#slider2").slider("value", 0);
    $("#slider3").slider("value", 0);
    $("#slider4").slider("value", 0);
}

/**
* Adds a caption to a table
* @param tableId: a string representation of a table id
*/
function AddCaption(table) {
    var tableCaption = table.createCaption();
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

/**
* sets up all the sliders
*/
function setupSliders() {
    $('#slider1').slider({
        value: 0,
        min: -100,
        max: 100,
        slide: function(event, ui) {
            $("#MultiplicandStart").val(ui.value); //bind slider to text box
        },
        stop: function(event, ui) {
            if (inputsHaveValues()) {
                $("#myTableForm").submit();
            }
        }
    });
    
    $('#slider2').slider({
        value: 0,
        min: -100,
        max: 100,
        slide: function(event, ui) {
            $("#MultiplicandEnd").val(ui.value);
        },
        stop: function(event, ui) {
            if (inputsHaveValues()) {
                $("#myTableForm").submit();
            }
        }
    });
    
    $('#slider3').slider({
        value: 0,
        min: -100,
        max: 100,
        slide: function(event, ui) {
            $("#MultiplierStart").val(ui.value);
        },
        stop: function(event, ui) {
            if (inputsHaveValues()) {
                $("#myTableForm").submit();
            }
        }
    });
    
    $('#slider4').slider({
        value: 0,
        min: -100,
        max: 100,
        slide: function(event, ui) {
            $("#MultiplierEnd").val(ui.value);
        },
        stop: function(event, ui) {
            if (inputsHaveValues()) {
                $("#myTableForm").submit();
            }
        }
    });
}

/**
* Checks if all input boxes have a value entered
* @return: boolean representing whether all input boxes have values
*/
function inputsHaveValues() {
    return ($('#MultiplicandStart').val() != "" 
        && $('#MultiplicandEnd').val() != "" 
        && $('#MultiplierStart').val() != ""
        && $('#MultiplierEnd').val() != "");
}

/**
* setting up initial tabs
*/
function setupTabs() {
	$('#tabs').tabs();
}

function addTabAndTable(tableDiv) {
	var tabCount = $('#tabs ul li').length + 1;
    var classToAdd = "<span class='ui-icon ui-icon-circle-close ui-closable-tab'id='span" + tabCount + "'></span>";
	
	//<li><a href = "#tab2">Tab 2</a></li>
	$('#tabs ul').append("<li><a href='#tab" + tabCount + "'>" 
        + $('#MultiplicandStart').val() + ", " 
        + $('#MultiplicandEnd').val() + ", " 
        + $('#MultiplierStart').val() + ", " 
        + $('#MultiplierEnd').val() + "</a>" + classToAdd + "</li>");
	
	//<div id="tab2"></div>
	$('#tabs').append("<div id='tab" + tabCount + "'></div>");
	
	$('#tab' + tabCount).height("90%");
    $('#tab' + tabCount).width("95%");
	
	$('#tab' + tabCount).append(tableDiv);
	
	$('#tabs').tabs("refresh");
    
}

function TabDeletionForm() {
    $('#myTableForm').hide(); //hide form so we can create deletion form
    $divInputs = $("<div id='TabDeletionInputs'></div>");
    $divButtons = $("<div id='TabDeletionButtons'></div>");
    $submitButton = $("<button id='submitDeletionForm'>Delete</button>")
    
    $form = $("<form id='TabDeletionForm'></form>"); //form
    
    $('#tabs ul li:not(:first-child)').each(function(index) {
        $divInputs.append("<div><input type='checkbox' id='checkboxForTab" + index+2 + "' value='" 
                        + $('a').eq(index+1).text() +"'>" 
                        + $('a').eq(index+1).text() + "</input></div>");
    });
      
    $submitButton.appendTo($divButtons);
    $divInputs.appendTo($form);
    $divButtons.appendTo($form);
    $form.appendTo('#NumberForm');
}

function DeleteSelectedTabs() {
    $("input:checked").each(function() { //loop through all checked boxes
        var value = $(this).attr('value');
        $('#tabList li:not(:first-child)').each(function(index) { //loop through all li to compare tab info

            if (value == $('a').eq(index+1).text()) {
                var tabId = $('a').eq(index+1).attr('href');
                $(tabId).remove(); //remove table for tab id
                $(this).remove(); //remove tab
            }
        });
    });
    
    $('#TabDeletionForm').remove(); //remove the form
    $('#myTableForm').show(); //show original form
}