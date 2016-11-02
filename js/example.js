/* File: /js/example.js
 91.461 In-class excercise 5: Using Javascript to change page items
 Scott Mello, student, UMass Lowell Computer Science, scott_mello@student.uml.edu
 Copyright (c) 2016 by Scott Mello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author. 

 Description: The is the JavaScript for the inclass 5 assignment*/

var list = document.getElementsByTagName("li"); //the li elements
var ul = document.getElementsByTagName("ul"); //ul[0] is the only ul element

// ADD NEW ITEM TO END OF LIST
var li = document.createElement("li"); //creating a new li element to add to ul
li.appendChild(document.createTextNode("cream"));
ul[0].appendChild(li);

// ADD NEW ITEM START OF LIST
li = document.createElement("li");
li.appendChild(document.createTextNode("kale"));
var ul = document.getElementsByTagName("ul"); //getting the ul so we can insert a new li at the top
ul[0].insertBefore(li, ul[0].childNodes[0]);

// ADD A CLASS OF COOL TO ALL LIST ITEMS
for (var i = 0; i < list.length; i++) {
    list[i].className = "cool";
}

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
var headerTwos = document.getElementsByTagName("h2"); //getting the h2 element so we can add the length of items and style it with span
var toAdd = "<span>" + list.length + "</span>"
headerTwos[0].innerHTML += toAdd;
