$(function () {
    //AddEventListeners();
    SetUpStarRatings();
    setupValidation();

});

function AddEventListeners() {
   
}

function SetUpStarRatings() {
   
   $('#your_rating_div').addClass('bigstars')
   
   $('#your_rating_div').rateit({
      step : 0.5,
      resetable : false,
      backingfld: '#input1',
      starwidth : 32,
      starheight : 32
   });
   
}

function setupValidation() {
   
   var span = '<span class="glyphicon glyphicon-ok form-control-feedback">'
   
   $('#review_form').validate({
      rules: {
         input2: {
            minlength: 2,
            required: true
         },
         input3: {
            minlength: 2,
            required: true
         }
      },
      highlight: function (element) {
         $(element).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
      },
      success: function (element) {
         $(element).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
      }
   });
}