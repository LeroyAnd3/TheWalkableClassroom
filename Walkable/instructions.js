function renderInstructionsPage() {
  $('#header_title').html('Instructions');
  $('#header_button1').css('visibility', 'visible');
  $('#header_button1').html('Home');

  var $view = $('#view');

  $view.html('');

    $view.append(
      '<div class="">'+
        'I am the Instructions Page'+
      '</div>'
    );
};
