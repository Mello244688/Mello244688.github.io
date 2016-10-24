// File: /js/HW6.js
// 91.461 Assignment 6: Creating an Interactive Dynamic Table
// Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
// Copyright (c) 2016 by Scott Mello. All rights reserved. May be
// freely copied or excerpted for educational purposes with credit to the
// author. 

// Description: The is the JabaScript for a single page web app that dynamically 
// 				creates a multiplication table based on form input from the user
// Date created: 10/24/2016

function onSubmitClicked() {
	var num1 = document.getElementById("num1").value;
	var num2 = document.getElementById("num2").value;
	var num3 = document.getElementById("num3").value;
	var num4 = document.getElementById("num4").value;
	var num5 = document.getElementById("num5").value;
	var num6 = document.getElementById("num6").value;
	var num7 = document.getElementById("num7").value;
	var num8 = document.getElementById("num8").value;
	var num9 = document.getElementById("num9").value;
	var num10 = document.getElementById("num10").value;
	
	var multiplicand = [num1, num2, num3, num4, num5];
	var multiplier = [num6, num7, num8, num9, num10];
	
	var tableId = "myTable";
	
	//setting inputs to zero if they were not provided
	SetDefaultInputs(multiplicand, multiplier);
	DeleteTable(tableId); //deleting table if there is one
	CreateTable(multiplicand, multiplier);
	AddCaption(tableId);

}
function CreateTable(multiplicand, multiplier) {
	var body = document.body;
	var table = document.createElement("table");
	var id = "myTable"; //id of the table
	var empty = "";
	var tableDiv = document.createElement('div');
	
	table.setAttribute('id', id); //setting id of table
	table.style.width = "95%"; //setting width of table
	table.style.border = "1px solid black"; //setting table border
	table.style.borderRadius = "8px"; //setting border radius of table
	table.style.margin = "0 auto"; //centering the table
	tableDiv.id = 'tableDiv'; //div that table goes in
	tableDiv.style.width = "50%"; //setting width of div
	tableDiv.style.minWidth = "540px"; //setting the minimum width of div
	tableDiv.style.padding = "25px"; //padding for div
	tableDiv.style.border = "2px solid #3377ff"; //border for div
	tableDiv.style.borderRadius = "8px"; //border radius of div
	tableDiv.style.backgroundColor = "#FFFFE6"; //div bgcolor
	tableDiv.style.marginTop = "15px"; //putting space between form and table
	
	for (var i = 0; i < multiplicand.length + 1; i++) {
		var row = document.createElement("TR");
		var cell;
		
		for (var j = 0; j < multiplier.length + 1; j++) {
			if (i == 0) { //create table heading
				cell = document.createElement("TH");
				var cellText;
				
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
				else {
					cell = document.createElement("TD");
					cellText = document.createTextNode(multiplicand[i - 1] * multiplier[j - 1]);
				}
			}
			cell.appendChild(cellText); //adding text to cell;
			cell.style.border = "1px solid black";
			cell.style.borderRadius = "2px";
			cell.style.textAlign = "center";
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
	tableDiv.appendChild(table);
	body.appendChild(tableDiv);
}

function DeleteTable(tableId) {
	var table = document.getElementById(tableId);
	var div = document.getElementById('tableDiv');
	//deleting table then div
	if (table != null) {
		table.parentNode.removeChild(table);
		div.parentNode.removeChild(div);
	}
}

function onResetClicked(table) {
	var emptyString = "";
	if(table) {
		DeleteTable(table.id);
	}
	
	//resetting borders 
	document.getElementById('num1').style.border = emptyString; 
	document.getElementById('num2').style.border = emptyString;
	document.getElementById('num3').style.border = emptyString;
	document.getElementById('num4').style.border = emptyString;
	document.getElementById('num5').style.border = emptyString; 
	document.getElementById('num6').style.border = emptyString;
	document.getElementById('num7').style.border = emptyString;
	document.getElementById('num8').style.border = emptyString;
	document.getElementById('num9').style.border = emptyString;
	document.getElementById('num10').style.border = emptyString;
	//enabling submit button
	document.getElementById('submitButton').removeAttribute("disabled");
}

function AddCaption(tableId) {
	var tableCaption = document.getElementById(tableId).createCaption();
	tableCaption.innerHTML = "<b>Multiplication Table</b>";
	
	tableCaption.style.color = "#3377ff";
	tableCaption.style.paddingBottom = "10px";
}

function validateInput(textBox) {
	var isValid = true; //used to check validity of current textbox
	var inputs = document.querySelectorAll('#NumberForm input[type=text]');
	var canSubmit = true;
	
	//checking that the text value is a number for current textbox
	if (isNaN(textBox.value )) {
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
	
	 //all text inputs are valid. enable submit button and remove red border 
	 //from textbox
	if (canSubmit && isValid) {
		document.getElementById('submitButton').removeAttribute("disabled");
		textBox.style.border = "";
	}
	//the current textbox input is valid but not others. remove red border
	//from textbox. disable the submit button
	else if (isValid) { 
		textBox.style.border = "";
		document.getElementById('submitButton').setAttribute("disabled", "disabled");
	}
	//current textbox input is invalid. disable the submit button and set a 
	//red border to current text box
	else { 
		document.getElementById('submitButton').setAttribute("disabled", "disabled");
		textBox.style.border = "2px solid red";
	}
}

function SetDefaultInputs(multiplicand, multiplier) {
	for (var i = 0; i < multiplicand.length; i++) {
		if (multiplicand[i].length < 1) {
			multiplicand[i] = 0;
		}
	}
	//setting inputs to zero if they were not provided
	for (var i = 0; i < multiplier.length; i++) {
	
		if (multiplier[i].length < 1) {
			multiplier[i] = 0;
		}
	}
}
