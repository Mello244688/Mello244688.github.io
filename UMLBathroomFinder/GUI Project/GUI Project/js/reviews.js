$(function () {
    AddEventListeners();
    SetUpStarRatings();

});

function AddEventListeners() {
   
   var default_title = "Enter title ...";
   
    $('#title').click(function() {
       if ($('#title').val().length && $('#title').val() == default_title) {
          $('#title').val(null);
       }
    });
    
    $('#title').focusout(function() {
       console.log($('#title').val().length);
       if ($('#title').val().length == 0) {
          $('#title').val(default_title);
       }
    });
}

function SetUpStarRatings() {
   
   $('#your_rating_div').addClass('bigstars')
   
   $('#your_rating_div').rateit({
      step : 0.5,
      resetable : false,
      backingfld: '#your_rating',
      starwidth : 32,
      starheight : 32
   });
   
}