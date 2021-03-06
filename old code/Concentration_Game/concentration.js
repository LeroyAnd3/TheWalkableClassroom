//Game logic for the concentration game.
//Author(s): Abby, Chris

//Index 0 is the termid, index 1 is the answer, indices > 1 are the hints
//Sample data
/* var terms = [
 	[0,"Apple","Red","Shiny","Fuji, Golden, Green","Caramelized","58% of these are produced in Washington"],
 	[1,"Pear","Green, not citrus","Crunchy"],
 	[2,"Grape","Purple","Squishy"],
 	[3,"Banana","Yellow","Peel"],
 	[4,"Orange","Orange","Related to tangerine"],
 	[5,"Blueberry","Blue","Berry"],
 	[6,"Blackberry","Black","Also known as mulberry"],
 	[7,"Pineapple","Spikey","Yellow fruit inside"],
 	[8,"Coconut","Brown","Fuzzy and hard"],
 	[9,"Cherry","Flavor of Cheerwine","Small red fruit"],
 	[10,"Lime","Resembles a lemon","Green citrus"]
 ];*/

var terms = [];
var topic;
// getCategoryTerms(topic,terms);
// addCategories();
var cardlist = [];
var addedCardList = [];
var clearedCardList = [];
var score = 0;
var moveCount=0;
var streakCount = 0;
var num;			//number of cards to be made
var selectTog=false;
var initialized = false;
var cardFlipDelay = 500; 	//delay of card flipping in ms
var isAnimating = false;	//boolean to keep track of whether or not an animation is going on, used for timing
var ans0,ans1,hint0,hint1,id0,id1,litID0,litID1,termID0,termID1;
var list;


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
  startGameTimer();
  setGameDetails();
  checkCardBackgrounds();
  initialized = true;
  var blankdiv = '<div class ="card" id="blank" style ="visibility:hidden" >'+" "+'</div>';
  var pairsCleared = 0;
  $('.card').on('click',function(){
  	//Only allow player to click on cards when an animation is not active
	if(!isAnimating){
		var newUl = document.createElement("ul");
	 	if(!selectTog){
		console.log(pickHint(parseInt($(this).attr('termID'))));
		//Get useful information from the selected card
		ans0 = $(this).attr('answer');
		hint0 = $(this).attr('hint');
		id0 = $(this).attr('id');
		termID0 = $(this).attr('termID');
		litID0 = $(this).attr('literalID');
		setCardToYellow($(this));
		selectTog = true;
		console.log("Answer:",ans0," Hint:",hint0," TermID:",termID0);
	}else{
		ans1 = $(this).attr('answer');
		hint1 = $(this).attr('hint');
		id1 = $(this).attr('id');
		termID1 = $(this).attr('termID');
		litID1 = $(this).attr('literalID');
		setCardToYellow($(this));
		console.log("Answer:",ans1," Hint:",hint1," TermID:",termID1);
		selectTog = false;
		moveCount++;
		$('#moveCounter').val(moveCount);
		//Checks to make sure that you're not matching two cards with the same INITIAL hint
		//It still works after hint swapping for this reason, kind of useful in that sense
		if(hint0!=hint1){
			if(ans0==ans1){
				//CORRECT MATCH: DO THE FOLLOWING
				//Reveal the matched pair
				turnCardCSS($('#'+id0),ans0);
				turnCardCSS($('#'+id1),ans1);
				//"Remove" the matched pair
				setTimeout(function(){
					$('#'+id0).replaceWith(blankdiv);
					$('#'+id1).replaceWith(blankdiv);
					isAnimating = false;
				},5*cardFlipDelay)
				//These operations below the timeout are meant to be done instantenously
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
				//INCORRECT MATCH: DO THE FOLLOWING
				//Play sound for wrong match
				var snd = new Audio("./resources/wrong.wav");
				snd.play();
				//Briefly reveal the answers for the mismatched cards
				turnCardCSS($('#'+id0),ans0);
				turnCardCSS($('#'+id1),ans1);
				//Set timeout operation to handle timing-sensitive functionality
				setTimeout(function(){
					//Shuffle the hints on the cards after flipping back over
					turnCardCSS($('#'+id0),pickHint($('#'+id0).attr('termID')));
					turnCardCSS($('#'+id1),pickHint($('#'+id1).attr('termID')));
					setCardBackground(id0);
					setCardBackground(id1);
					isAnimating = false;
				},3*cardFlipDelay)
				//These operations below the timeout are meant to be done instantenously
				//Decrement the player's score for wrong match (resets streak multiplier)
				score = score - 50;
				streakCount = 0;
				$('#gameScore').val(score);
				$('#streakCounter').val(streakCount);
				resetSelections();
			}
		}else{
		 setCardBackground(id0);
		 setCardBackground(id1);
		}
	}
	}

 });
}

function setGameDetails(){
  $('#gametitle').html("Concentration Game: "+topic);
  $('.card').css("color","black");
  $('.card').css("text-shadow","2px 0 white, 0 2px white, 2px 0 white, 0 -2px white");
  $('.card').css("font-family","sans-serif");
  $("#cardbackground").attr("disabled","disabled");
  $("#play").attr("disabled", "disabled");
}

function startGameTimer(){
  jQuery(function ($) {
     var zero = 0,
     display = $('#time');
     startTimer(0, display);
     document.getElementById('time').style.visibility = 'visible';
     });
}

//Flips an elem over and sets its text to the string parameter
//Designed for divs
function turnCardCSS(elem, textToSet){
 isAnimating = true;
 var element = elem;
 var text = textToSet;
 $(element)
 	.addClass("flipping")
	.bind("transitionend webkittransitionend",function(){
		$(this)
			.unbind("transitionend webkittransitionend")
			.removeClass("flipping")
	})
 setTimeout(function(){
 	$(element).text(text);
 },cardFlipDelay)
}

function setCardToYellow(elem){
 $(elem).css("background-image","none");
 $(elem).css("background-color","yellow");
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
 //Don't allow hint functionality if an animation is already in progress
 if(isAnimating) {console.log("Animation in progress, try hint functionality later"); return;}
 var blankdiv = '<div class ="card" id="blank" style ="visibility:hidden" >'+" "+'</div>';
 var i = getRandomIntInclusive(0,num-1);
 var delay1 = 4*cardFlipDelay;
 var delay2 = 8*cardFlipDelay;
 if(clearedCardList.length==num) {console.log("No more hints to clear..."); return;}
 while(clearedCardList.includes(i.toString())) {i=getRandomIntInclusive(0,num-1);}
 isAnimating = true;
 if(i%2==0){
	//Highlight the cards about to be cleared
 	setCardToYellow($('#card'+i));
	setCardToYellow($('#card'+(i+1)));
	//Turn the highlighted cards over to reveal the answer
	setTimeout(function(){
		turnCardCSS($('#card'+i),$('#card'+i).attr('answer'));
		turnCardCSS($('#card'+(i+1)),$('#card'+(i+1)).attr('answer'));
	},delay1)
	//Remove the highlighted cards from the playable deck
	setTimeout(function(){
		$('#card'+i).replaceWith(blankdiv);
		$('#card'+(i+1)).replaceWith(blankdiv);
		isAnimating = false;
	},delay2)
 		clearedCardList.push(i.toString()); clearedCardList.push((i+1).toString());
 }else{
 	//Highlight the cards about to be cleared
	setCardToYellow($('#card'+i));
	setCardToYellow($('#card'+(i-1)));
	//Turn the highlighted cards over to reveal the answer
	setTimeout(function(){
		turnCardCSS($('#card'+i),$('#card'+i).attr('answer'));
		turnCardCSS($('#card'+(i-1)),$('#card'+(i-1)).attr('answer'));
	},delay1)
	//Remove the highlighted cards from the playable deck
	setTimeout(function(){
		$('#card'+i).replaceWith(blankdiv);
		$('#card'+(i-1)).replaceWith(blankdiv);
		isAnimating = false;
	},delay2)
	clearedCardList.push(i.toString()); clearedCardList.push((i-1).toString());
 }
 score = score - 100;
 streakCount = 0;
 $('#gameScore').val(score);
 $('#streakCounter').val(streakCount);
}

//Automatically solve the entire board
//Should allow the player to view the cleared cards somewhere (?)
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
 score = -9999;
 streakCount = -100;
 $('#gameScore').val(score);
 $('#streakCounter').val(streakCount);
 console.log(clearedCardList.toString());
}

//Controls the timer for the game
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
        setInterval(function () {
	        minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		display.text(minutes + ":" + seconds);
		timer++;
	//	if (--timer < 0) {
	//        	timer = duration;
	//	}
	}, 1000);
}

function failedToStart(){
 alert("Not enough terms...");
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

//Presents the current categories to the user
function addCategories(){
  alert("in addCategories");
  console.log(categories);
  for(let i=0; i<categories.length;i++){
    let option = document.createElement("option");
    let node = document.createTextNode(categories[i]);
    option.appendChild(node);
    let element = document.getElementById("categories");
    element.appendChild(option);
  }
}

// function appendCategories(){
//   alert("in append categories")
//   console.log(categories);
//
//   let option = document.createElement('option');
//   for(let i=0;i<categories.length;i++){
//     alert('hi');
//     console.log("round of appending: " + i);
//     option.text = categories[i];
//     category.add(option);
//   }
// }

$(document).ready( function(){
  alert('document ready');
  appendCategories();
  let category = document.getElementById('categories');

  $('#play').click( function() {
     topic = category.value;
     getCategoryTerms(topic,terms);
     setTimeout(function(){
       checkBoardConfig();
  });


  $('#quit').click( function() {
    $("#play").attr("disabled", "disabled");
    $("#quit").attr("disabled", "disabled");
  });


  $('#restart').click( function() {
    window.location.reload();
  });

 $('#hint').click(function(){
 	if(initialized){hintFunction();}
 });

 $('#solve').click(function(){
	if(initialized){solveFunction();}
 });

});
