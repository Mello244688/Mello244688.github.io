$(function() {
	$('ul').before('<p>last updated</p>');
	$('li.hot').prepend('+ ');
	var $newItem = $('<li><em>gluten-free</em>soy sauce</li>');
	$('li:last').after($newItem);
});