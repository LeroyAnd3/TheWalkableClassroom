function renderDeckCollection() {
  $('#header_title').html('Deck Collection');
  $('#header_button1').css('visibility', 'visible');
  $('#header_button2').css('visibility', 'visible');
  $('#header_button1').html('Home');
  $('#header_button2').html('Card Catalogue');

  $('#view').html('');

  for(deck of data.decks) {
    // console.log(deck.id, data.selectedDeck);
    $('#view').append(
      '<div id=' + `${deck.id}` + ' onclick= setDeckId(' + Number(deck.id) + ')  class="cardDiv">'+
        '<div class="card1">'+
          '<div class="card2">'+
            '<div class="card3" style= ' + `${(deck.id === data.selectedDeckId)? "background-color:yellow": ""}`+ '>'+
            '<div style="float:right;"><button onclick="callDeleteCategory()" class="xButton" id=' + `${deck.id}`+'>x</button></div>'+
              'Subject:'+
              '<br></br>'+
              `${deck.subject}`+
              '<br></br>'+
              'Card Count:'+
              `${deck.cardIds.length}`+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'
    );
  }



  $('#view').append(
    '<div id="addDiv" onclick=addDeck()>'+
      '<button id="addButton">'+
        '+'+
      '</button>'+
    '</div>'
  );

  $('#view').append(
    renderModal()
  );

};

function renderModal() {
  $('.modal').css('display', 'block');
  return (
    '<div class="modal">'+
      '<div id="deckMaker">'+
        '<button onclick="callCreateCategory()" class="deckModalXButton">'+
          'X'+
        '</button>'+
        renderSubjectInput() +
      '</div>'+
    '</div>'
  );
}

function renderSubjectInput() {
  let selectedDeck = getDeckById(data.selectedDeckId);
  $('#subjectInput').val(selectedDeck.subject)
  return (
    '<div>'+
      '<label style="display: block; font-size:20px;">Please Decide on a Name for the Subject Category:</label>'+
      '<input id="subjectInput" onkeyup="updateDeckSubject()" value="' + selectedDeck.subject + '"/>'+
    '</div>'
  );
}

// function updateSubject() {
//   let selectedDeck = getDeckById(data.selectedDeck);
//   selectedDeck.subject = $('#subjectInput').val();
//   renderModal();
// }

// function addDeckOld() {
//   console.log("The old add deck");
//   data.decks.push(
//     {
//       id: data.deckNumber,
//       subject: '',
//       cardIds: []
//     }
//   );
//   data.selectedDeck = data.deckNumber;
//   data.deckNumber++;
//   renderDeckCollection();
//   $('.modal').css('display', 'block');
// }

function deleteDeck(deckId) {
  data.decks = data.decks.filter(function(deck){
    return deck.id !== Number(deckId);
  });
  renderDeckCollection();
}

// function getDeckByIdOld(id) {
//   return data.decks.filter(function(deck){
//     return deck.id === Number(data.selectedDeck);
//   })[0] || {cardIds:[]};
// }

function callCreateCategory(){
  let selectedDeck = getDeckById(data.selectedDeckId);
  let object = $('#subjectInput').val(selectedDeck.subject);
  let id = selectedDeck.id;
  let value = object[0].value; //value of category
  if(value === null || value.length === 0 || value === "undefine"){
    alert("The value for category is blank." +
          " Please enter a name for this deck");
    deleteDeck(id);
    return false;
  }
  //console.log(value);
 createCategory(value,id);
}

function callDeleteCategory(){
  alert("in callDeleteCategory");
  let selectedDeck = getDeckById(data.selectedDeckId);
  let object = $('#subjectInput').val(selectedDeck.subject);
  let id = selectedDeck.id;
  let value = object[0].value; //value of category
  findKey(value,id);
}
