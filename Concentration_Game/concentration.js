//Game logic for the concentration game.
//Author(s): Abby, Chris
var paused;

//Index 0 is the termid, index 1 is the answer, indices > 1 are the hints
//A strict requirement of each term requiring >= 2hints is important
var terms = [
	[0,"Apple","Red","Shiny","Fuji, Golden, Green","Caramelized","58% of these are produced in Washington"],
	[1,"Pear","Green","Crunchy"],
	[2,"Grape","Purple","Squishy"],
	[3,"Banana","Yellow","Peel"],
	[4,"Orange","Orange","Related to tangerine"],
	[5,"Blueberry","Blue","Berry"],
	[6,"Blackberry","Black","Also known as mulberry"],
	[7,"Pineapple","Spikey","Yellow fruit inside"],
	[8,"Coconut","Brown","Fuzzy and hard"]
];

var cardlist = [];
var moveCount=0;
var num = terms.length*2;
var selectTog=false;
var initialized = false;
var ans0,ans1,hint0,hint1,id0,id1,termID0,termID1;

class Card{
        constructor(id,answer,hint,itemid){
	this.id = id;
        this.answer = answer;
        this.hint = hint;
	this.itemid = itemid;
        this.div='<div class ="card" termID ='+itemid+' hint='+hint+'  answer='+answer+'  id="card' +id +'">'+hint+'</div>';
 }
}

function checkBoardConfig(){
  $('#default').each(function() {
    if (this.selected) {makeRectBoard(num);}
  });

  $('#rectangle').each(function() {
    if (this.selected) {makeRectBoard(num);}
  });

  $('#square').each(function() {
    if (this.selected) {makeSqConfig();}
  });
}

function makeRectBoard(numcards){
 prepareCards(numcards);
 shuffleCards(cardlist);
 var row,i,j,x;
 var index = 0;
 width = 6;
 for(i=0;i<3;i++){
 	x = width*i;
	row = '<div id="row">';
	for(j=0;j<width;j++){
	 row += cardlist[index].div;
	 index++;
	}
	row += '</div>';
	$('#deck').append(row);
 }
 initializeGame(numcards);
}

//Create cards for the card list
//Recall that terms[X][1] is the name/answer of terms[X]
function prepareCards(n){
 var i;
 var cardID = 0;
 var itemID = 0;
 var paired = false;
 var a,b;
 for(i=0;i<n;i++){
 	if(!paired){
		a = getRandomIntInclusive(2,terms[itemID].length-1); 
		var card = new Card(cardID,terms[itemID][1],terms[itemID][a],itemID);
	} 	
	if(paired){
		b = getRandomIntInclusive(2,terms[itemID].length-1);
		while(a==b){b=getRandomIntInclusive(2,terms[itemID].length-1);}	//prevent a==b (i.e. same hint for same termID)
		var card = new Card(cardID,terms[itemID][1],terms[itemID][b],itemID);
	} 	
	if(paired) itemID++;
	paired = !paired;
	cardlist.push(card);
	cardID++;
 }
}

//Shuffle the cards in the card list
function shuffleCards(array){
 var i,j,x;
 for(i=array.length;i;i--){
 	j = Math.floor(Math.random()*i);
	x = array[i-1];
	array[i-1] = array[j];
	array[j] = x;
 }
}

function initializeGame(numcards){
  initialized = true;
  var blankdiv = '<div class ="card" id="blank" style ="visibility:hidden" >'+" "+'</div>';
  var pairsCleared = 0;
  $('.card').on('click',function(){
 	if(!selectTog){
		console.log(pickHint(parseInt($(this).attr('termID'))));
		//Get useful information from the selected card
		ans0 = $(this).attr('answer');
		hint0 = $(this).attr('hint');
		id0 = $(this).attr('id');
		termID0 = $(this).attr('termID');
		$(this).css("background-color","yellow");
		selectTog = true;
		console.log("Answer:",ans0," Hint:",hint0," TermID:",termID0);
	}else{
		ans1 = $(this).attr('answer');
		hint1 = $(this).attr('hint');
		id1 = $(this).attr('id');
		termID1 = $(this).attr('termID');
		console.log("Answer:",ans1," Hint:",hint1," TermID:",termID1);
		selectTog = false;
		moveCount++;
		//Checks to make sure that you're not matching two cards with the same INITIAL hint
		//It still works after hint swapping for this reason, kind of useful in that sense
		if(hint0!=hint1){
			if(ans0==ans1){
				alert("It's a..."+ans0+"!");	
				//"Remove" the matched pair
				$('#'+id0).replaceWith(blankdiv);
				$('#'+id1).replaceWith(blankdiv);
				resetSelections();
				//Check if all the pairs have been cleared
				pairsCleared++;
				if(pairsCleared==(numcards/2)){
					//Stuff when the board is cleared
					alert("You cleared the board!");	
				}
			}else{
				//Shuffle hints on cards
				$('#'+id0).text(pickHint($('#'+id0).attr('termID')));
				$('#'+id1).text(pickHint($('#'+id1).attr('termID')));
				resetSelections();

			}
			$('#'+id0).css("background-color","white");
			$('#'+id1).css("background-color","white");

		}else{
		 $('#'+id0).css("background-color","white");
		 $('#'+id1).css("background-color","white");
		}
	}
 });
}

//Picks a random hint from a term in the terms array at the specified index
function pickHint(index){
 var len = terms[index].length-1;
 var pos = Math.round(Math.random()*(len-2));	
 pos = pos+2;	//skip over id and answer fields in the terms list 
 console.log("Index:",index," Pos:",pos);
 return terms[index][pos];
}

//Returns a random int in the range [min,max]
function getRandomIntInclusive(min,max){
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random()*(max-min+1))+min;
}

//Resets the selection vars and appropriate fields
function resetSelections(){
 ans0 = null; ans1 = null;
 hint0 = null; hint1 = null;
 termID0 = null; termID1 = null;
 //console.log("-----Reset choices to null-----");
}

function makeSqConfig(){
  var row, i, j, x;
  width = 3;

  for (i=0; i<width; i++){
    x = ( width * i);
    row = '<div id="row">';

    for (j=1; j<(width +1); j++){
      row += '<div class ="card" id="card' + (x+j) +'">Card ' + (x+j) +'</div>';
    }
    row += '</div>';
    $('#deck').append(row);
  }
  initializeGame();
}

function makeRectConfig(){
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
  initializeGame();
}

$(document).ready( function(){

  $('#play').click( function() {
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

