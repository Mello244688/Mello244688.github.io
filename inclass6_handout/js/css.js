$(function() {
    var bgColor = $('li:nth-child(1)').css('backgroundColor');
    $('ul').after('<p></p>');
    $('p').append("Color was: " + bgColor);
    $('li').css ({
        'background-color': '#c5a996',
        'border': '1px solid white',
        'color': 'black',
        'text-shadow': 'none',
        'font-family': 'Georgia'
    });
});