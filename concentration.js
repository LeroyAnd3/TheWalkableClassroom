var paused;
var cards = {
  card1: {id:1, property:"grape", clue1: "purple", clue2:"squishy & round"},
  card2: {id:2, property:"pineapple", clue1: "yellow/green", clue2:"spikey"},
  card3: {id:3, property:"cherry", clue1: "red", clue2:"pit inside"},
  card4: {id:4, property:"blueberry", clue1: "blue", clue2:"grows on a bush"}
};

function checkBoardConfig(){
  $('#default').each(function() {
    if (this.selected) {
      // alert('the default option has been selected');
      makeRectConfig();
      //$('#cards').append();
    }
  });

  $('#rectangle').each(function() {
    if (this.selected) {
      // alert('the rectangle option has been selected');
      makeRectConfig();
      //$('#cards').append();
    }
  });

  $('#square').each(function() {
    if (this.selected) {
      // alert('the square option has been selected');
      makeSqConfig();
    }
  });
}

function makeRectConfig(){
  // alert("making rectangular config");
  var row, i, j, x;
  width = 6;

  for (i=0; i<3; i++){
    x = ( width * i);
    row = '<div id="row">';

    for (j=1; j<(width+1); j++){
      row += '<div class ="card" id="card' + (x+j) +'">Card ' + (x+j) +'</div>';
    }
    row += '</div>';
    $('#deck').append(row);
  }
}

function makeSqConfig(){
  // alert("making square config");
  var row, i, j, x;
  width = 3;

  for (i=0; i<(width); i++){
    x = ( width * i);
    row = '<div id="row">';

    for (j=1; j<(width +1); j++){
      row += '<div class ="card" id="card' + (x+j) +'">Card ' + (x+j) +'</div>';
    }
    row += '</div>';
    $('#deck').append(row);
  }
}

$(document).ready( function(){
  $('#play').click( function() {
    // alert("play clicked");
     paused = 0; // 0 = no, 1 = yes

    $("#play").attr("disabled", "disabled");
    $("#gameScore").val(0);

    checkBoardConfig();
  });


  $('#quit').click( function() {
    $("#play").attr("disabled", "disabled");
    $("#pause").attr("disabled", "disabled");
    $("#quit").attr("disabled", "disabled");
  });


  $('#restart').click( function() {
    window.location.reload();
  });

  $('#pause').click( function() {
    if (paused == 0) { // in game play
      // stop timer
      alert("pausing game");
      paused = 1;
    }
    else if (paused == 1){ // game play is already paused
      // restart timer
      alert("resuming game");
      paused = 0;
    }
    else {
      alert("paused is not 0 or 1");
    }
  });
});
