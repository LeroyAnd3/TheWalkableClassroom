function renderStartScreen() {
  var $view = $('#view');
  $('#header_title').html('The Flippable Classroom');
  $('#header_button1').css('visibility', 'hidden');
  $('#header_button2').css('visibility', 'hidden');

  $view.html('');

  $view.append(
    '<div id="starterPageContainer">'+
      '<button id="game_button" class="starter_page_button">'+
      'Play the Game!'+
      '</button>'+
      '<button id="instructions_button" class="starter_page_button">'+
      'Instructions'+
      '</button>'+
      '<button id="maker_button" class="starter_page_button">'+
      'Make Game Content'+
      '</button>'+
    '</div>'
  );
}
