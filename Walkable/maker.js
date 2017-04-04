function renderCardMaker() {
  $('#header_title').html('Card Maker');
  $('#header_button1').html('Back');
  $('#header_button2').html('Home');

  var $view = $('#view');

  $view.html('');

    $view.append(
      '<div class="">'+
        'I am the Card Maker'+
      '</div>'
    );
};
