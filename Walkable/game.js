function renderGameView() {
  $('#header_title').html('The Flippable Classroom: Game');
  $('#header_button1').css('visibility', 'visible');
  $('#header_button1').html('Home');

  var $view = $('#view');

  $view.html('');

    $view.append(
      '<div style="display: flex; justify-content:center;" class="container">'+
        '<form class="userInputs">'+
    			'<select id="boardconfig">'+
      			'<option id="default" value="default">Select a board configuration</option>'+
      			'<option id="rectangle3x4" value="rectangle3x4">Rectangle Small (3x4)</option>'+
    			'<option id="rectangle3x6" value="rectangle3x6">Rectangle Medium (3x6)</option>'+
    			'<option id="rectangle4x7" value="rectangle4x7">Rectangle Large (4x7)</option>'+
      			'<option id="square" value="square">Square</option>'+
    			'</select>'+

    			'<select id="cardbackground">'+
    			'<option id="defaultback" value="defaultback">Select card background</option>'+
    			'<option id="naturalwhite" value="naturalwhite">Natural White</option>'+
    			'<option id="naturalblack" value="naturalblack">Natural Black</option>'+
    			'<option id="sayagata" value="sayagata">Sayagata</option>'+
    			'<option id="retinawood" value="retinawood">Retina Wood</option>'+
    			'<option id="circlesround" value="circlesround">Circles and Roundabouts</option>'+
    			'<option id="oldmap" value="oldmap">Old Map</option>'+
    			'<option id="skulls" value="skulls">Skulls</option>'+
    			'</select>'+

    			'<button type="button" id="play"> Play! </button>'+
    			'<button type="button" id="restart"> Restart </button>'+
    			'<button type="button" id="hint"> Hint </button>'+
    			'<button type="button" id="solve"> Solve </button>'+
    			'<button type="button" id="quit"> Quit </button>'+
    		'</form>'+
    	'<div>'+
    		'<span id="time" style="visibility:hidden">00:00</span>'+
    	'</div>'+
      '</div>' +
      '<div id="deck"></div>' +
      '<form id="scoreBoard">'+
      		'Move Count: <input type="number" id="moveCounter" value="0" readonly>'+
      		'Score: <input type="number" id="gameScore" value="0" readonly>'+
      		'Streak Count: <input type="number" id="streakCounter" value="0" readonly>'+
      	'</form>'
    );
};
