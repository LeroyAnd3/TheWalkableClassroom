//Game logic for the concentration game.
//Author(s): Abby, Chris
var paused;

//Index 0 is the termid, index 1 is the answer, indices > 1 are the hints
//A strict requirement of each term requiring >= 2hints is important
// var terms = [
// 	[0,"Apple","Red","Shiny","Fuji, Golden, Green","Caramelized","58% of these are produced in Washington"],
// 	[1,"Pear","Green, not citrus","Crunchy"],
// 	[2,"Grape","Purple","Squishy"],
// 	[3,"Banana","Yellow","Peel"],
// 	[4,"Orange","Orange","Related to tangerine"],
// 	[5,"Blueberry","Blue","Berry"],
// 	[6,"Blackberry","Black","Also known as mulberry"],
// 	[7,"Pineapple","Spikey","Yellow fruit inside"],
// 	[8,"Coconut","Brown","Fuzzy and hard"],
// 	[9,"Cherry","Flavor of Cheerwine","Small red fruit"],
// 	[10,"Lime","Resembles a lemon","Green citrus"],
// 	[11,"Kiwi","Small and brown","Green fruit with black seeds"],
// 	[12,"Raisin","Used to be a grape","Oatmeal and..."],
// 	[13,"Avocado","Used in california rolls (sushi)","Native to Mexico"],
// 	[14,"Carrot","Often associated with rabbits","Orange vegetable with green stem"],
// 	[15,"Mushroom","Can be found in the wild, may be poisonous though","Often used as a pizza topping"],
// 	[16,"Spinach","Gives Popeye super strength","Often used in quiches"],
// 	[17,"Ghost chili","Alternative name: bhut jolokia","World's hottest (natural) chili pepper"],
// 	[18,"Tomato","Biologically a fruit, but taxed as a vegetable","Red when ripe, has green stem"],
// 	[19,"Corn","Also known as maize","Often grown in large fields on stalks"],
// 	[20,"Cauliflower","A variety of cabbage","The head of the vegetable is a white flower"],
// ];
var terms = []
getCategoryTerms("Fruits",terms);

var cardlist = [];
var addedCardList = [];
var clearedCardList = [];
var score = 0;
var moveCount=0;
var streakCount = 0;
var num;	//number of cards to be made
var selectTog=false;
var initialized = false;
var ans0,ans1,hint0,hint1,id0,id1,litID0,litID1,termID0,termID1;

class Card{
        constructor(id,answer,hint,itemid){
	this.id = id;
        this.answer = answer;
        this.hint = hint;
	this.itemid = itemid;
        this.div='<div class ="card" termID ='+itemid+' hint="'+hint+'"  answer="'+answer+'" literalID = '+id+' id="card' +id +'">'+hint+'</div>';
 }
}

function checkBoardConfig(){
  $('#rectangle3x4').each(function() {
    if (this.selected) {if(terms.length>=6){num=12; makeRectBoard(12,3,4);}else{failedToStart();}}
  });

  $('#rectangle3x6').each(function(){
    if(this.selected) {if(terms.length>=9){num=18; makeRectBoard(18,3,6);}else{failedToStart();}}
  });

  $('#rectangle4x7').each(function(){
    if(this.selected) {if(terms.length>=14){num=28; makeRectBoard(28,4,7);}else{failedToStart();}}
  });

  $('#square').each(function() {
    if (this.selected) {if(terms.length>=8){num=16; makeRectBoard(16,4,4);}else{failedToStart();}}
  });

  $('#default').each(function() {
    if (this.selected) {if(terms.length>=9){num=18; makeRectBoard(18,3,6);}else{failedToStart();}}
  });
}

function makeRectBoard(numcards,rows,columns){
 prepareCards(rows*columns);
 shuffleCards(cardlist);
 var row,i,j,x;
 var index = 0;
 for(i=0;i<rows;i++){
 	x = columns*i;
	row = '<div id="row">';
	for(j=0;j<columns;j++){
	 row += cardlist[index].div;
	 index++;
	}
	row += '</div>';
	$('#deck').append(row);
 }
 initializeGame(rows*columns);
}

//Create cards for the card list
//Recall that terms[X][1] is the name/answer of terms[X]
function prepareCards(n){
 var i;
 var cardID = 0;
 var itemID = getRandomIntInclusive(0,terms.length-1);
 var paired = false;
 var a,b;
 for(i=0;i<n;i++){
 	if(!paired){
		//Pick a random term from the terms list that hasn't been added
		while(addedCardList.includes(itemID)) {itemID=getRandomIntInclusive(0,terms.length-1);}
		//Keep track of terms already added to the game
		addedCardList.push(itemID);
		//Pick a new, random hint from the random term chosen
		a = getRandomIntInclusive(2,terms[itemID].length-1);
		//Create the card for this hint
		var card = new Card(cardID,terms[itemID][1],terms[itemID][a],itemID);
	}
	if(paired){
		b = getRandomIntInclusive(2,terms[itemID].length-1);
		while(a==b){b=getRandomIntInclusive(2,terms[itemID].length-1);}	//prevent a==b (i.e. same hint for same termID)
		var card = new Card(cardID,terms[itemID][1],terms[itemID][b],itemID);
	}
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
  $('.card').css("color","black");
  $('.card').css("text-shadow","2px 0 white, 0 2px white, 2px 0 white, 0 -2px white");
  $('.card').css("font-family","sans-serif");
  $("#cardbackground").attr("disabled","disabled");
  $("#play").attr("disabled", "disabled");
  checkCardBackgrounds();
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
		litID0 = $(this).attr('literalID');
		$(this).css("background-image","none");
		$(this).css("background-color","yellow");
		selectTog = true;
		console.log("Answer:",ans0," Hint:",hint0," TermID:",termID0);
	}else{
		ans1 = $(this).attr('answer');
		hint1 = $(this).attr('hint');
		id1 = $(this).attr('id');
		termID1 = $(this).attr('termID');
		litID1 = $(this).attr('literalID');
		console.log("Answer:",ans1," Hint:",hint1," TermID:",termID1);
		selectTog = false;
		moveCount++;
		$('#moveCounter').val(moveCount);
		//Checks to make sure that you're not matching two cards with the same INITIAL hint
		//It still works after hint swapping for this reason, kind of useful in that sense
		if(hint0!=hint1){
			if(ans0==ans1){
				alert("It's a..."+ans0+"!");
				//"Remove" the matched pair
				$('#'+id0).replaceWith(blankdiv);
				$('#'+id1).replaceWith(blankdiv);
				//Add the cleared cards to the cleared card list by their literal ID
				clearedCardList.push(litID0);
				clearedCardList.push(litID1);
				//Print the cleared card list
				console.log(clearedCardList.toString());
				//Add to the player's score for correct match (includes streak multiplier)
				score = score + 100 + (50*streakCount);
				streakCount++;
				resetSelections();
				//Play sound for correct match
				var snd = new Audio("./resources/correct.wav");
				snd.play();
				//Check if all the pairs have been cleared
				pairsCleared++;
				if(pairsCleared==(numcards/2)){
					//Stuff when the board is cleared
					//If the player matched all cards without breaking the streak...
					if(streakCount==(numcards/2)) {alert("Perfect clear!");}
					else{alert("You cleared the board!");}
				}
				$('#gameScore').val(score);
				$('#streakCounter').val(streakCount);
			}else{
				//Play sound for wrong match
				var snd = new Audio("./resources/wrong.wav");
				snd.play();
				//Shuffle hints on cards
				$('#'+id0).text(pickHint($('#'+id0).attr('termID')));
				$('#'+id1).text(pickHint($('#'+id1).attr('termID')));
				setCardBackground(id0);
				//Decrement the player's score for wrong match (resets streak multiplier)
				score = score - 50;
				streakCount = 0;
				$('#gameScore').val(score);
				$('#streakCounter').val(streakCount);
				resetSelections();
			}
			setCardBackground(id0);
			setCardBackground(id1);

		}else{
		 setCardBackground(id0);
		 setCardBackground(id1);
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

//Automatically clears a pair of uncleared cards. Checks the cleared card list values
function hintFunction(){
 var blankdiv = '<div class ="card" id="blank" style ="visibility:hidden" >'+" "+'</div>';
 var i = getRandomIntInclusive(0,num-1);
 if(clearedCardList.length==num) {console.log("No more hints to clear..."); return;}
 while(clearedCardList.includes(i.toString())) {i=getRandomIntInclusive(0,num-1);}
 //console.log(clearedCardList.toString());
 //console.log(i);
 if(i%2==0){
 	$('#card'+i).replaceWith(blankdiv);
	$('#card'+(i+1)).replaceWith(blankdiv);
	clearedCardList.push(i.toString()); clearedCardList.push((i+1).toString());
 }else{
 	$('#card'+i).replaceWith(blankdiv);
	$('#card'+(i-1)).replaceWith(blankdiv);
	clearedCardList.push(i.toString()); clearedCardList.push((i-1).toString());
 }
}

//Automatically solve the entire board
function solveFunction(){
 var blankdiv = '<div class ="card" id="blank" style ="visibility:hidden" >'+" "+'</div>';
 while(clearedCardList.length!=num){
 	var i = getRandomIntInclusive(0,num-1);
	while(clearedCardList.includes(i.toString())) {i=getRandomIntInclusive(0,num-1);}
	if(i%2==0){
 		$('#card'+i).replaceWith(blankdiv);
		$('#card'+(i+1)).replaceWith(blankdiv);
		clearedCardList.push(i.toString()); clearedCardList.push((i+1).toString());
	 }else{
 		$('#card'+i).replaceWith(blankdiv);
		$('#card'+(i-1)).replaceWith(blankdiv);
		clearedCardList.push(i.toString()); clearedCardList.push((i-1).toString());
	 }
 }
 alert("Auto-solving the board...");
 console.log(clearedCardList.toString());
}

//Checks and sets card backgrounds based on the user's choice
function checkCardBackgrounds(){
 $('#defaultback').each(function() {
  if(this.selected) {$('.card').css("background-color","white");}
 });
 $('#naturalwhite').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/ep_naturalwhite.png)");}
 });
 $('#naturalblack').each(function(){
  if(this.selected) {
  	$('.card').css("background-image","url(./resources/ep_naturalblack.png)");
	$('.card').css("color","white");
  	$('.card').css("text-shadow","2px 0 black, 0 2px black, 2px 0 black, 0 -2px black");
  }
 });
 $('#sayagata').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/sayagata-400px.png)");}
 });
 $('#retinawood').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/retina_wood.png");}
 });
 $('#circlesround').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/circles-and-roundabouts.png)");}
 });
 $('#oldmap').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/old_map.png)");}
 });
 $('#skulls').each(function(){
  if(this.selected) {$('.card').css("background-image","url(./resources/skulls.png)");}
 });
}

//Resets the background for a particular card
function setCardBackground(id){
 $('#defaultback').each(function() {
  if(this.selected) {$('#'+id).css("background-color","white");}
 });
 $('#naturalwhite').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/ep_naturalwhite.png)");}
 });
 $('#naturalblack').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/ep_naturalblack.png)");}
 });
 $('#sayagata').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/sayagata-400px.png)");}
 });
 $('#retinawood').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/retina_wood.png");}
 });
 $('#circlesround').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/circles-and-roundabouts.png)");}
 });
 $('#oldmap').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/old_map.png)");}
 });
 $('#skulls').each(function(){
  if(this.selected) {$('#'+id).css("background-image","url(./resources/skulls.png)");}
 });
}

function failedToStart(){
 alert("Not enough terms...");
}

$(document).ready( function(){

  $('#play').click( function() {
     paused = 0; // 0 = no, 1 = yes

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

 $('#hint').click(function(){
 	if(initialized){hintFunction();}
 });

 $('#solve').click(function(){
	if(initialized){solveFunction();}
 });

});
