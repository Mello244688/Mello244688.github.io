$(function() {
	$('li:contains("pine")').text("almonds"); 
	$('li.hot').html(function() {
		var text = $(this).text();
		return "<em>" + text + "</em>";
	});
	$('li#one').remove();
});