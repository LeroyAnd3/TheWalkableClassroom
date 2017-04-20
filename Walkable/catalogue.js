function renderCardModal(){
  return (
    '<div id="cardMaker">'+
      renderModalButton() +
      '<br></br>'+
      renderTermInput() +
      renderHintList() +
    '</div>'+
  )
}

function renderModalButton() {
  return (
    '<button onclick="callCreateTerm()" class="cardModalXButton2">'+
      'X'+
    '</button>'
  );
}

function renderTermInput() {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCardId);
  })[0] || {hints:[]};
  console.log(data.selectedCardId);
  return (
    '<div>'+
      '<label style="display: block;">Term:</label>'+
      '<input id="termInput" onkeyup="updateCardTerm()" value="' + selectedCard.term + '"/>'+
    '</div>'
  );
}

function renderHintList() {
  $('.modal').css('display', 'block');
  var selectedCard = getCardById(data.selectedCardId);

  return (
    '<div>'+
      '<label style="float:left; display:block;">Hint List:</label>'+
      '<div id="hintList" >'+

          renderHint(1, selectedCard) +
          renderHint(2, selectedCard) +
          renderHint(3, selectedCard) +
          renderHint(4, selectedCard) +
          renderHint(5, selectedCard) +
          renderHint(6, selectedCard) +
          renderHint(7, selectedCard) +
          renderHint(8, selectedCard) +

      '</div>' +
    '</div>'
  );
}

function renderHint(number, card) {
  var $hint = $('#hint'+number)
  var formerhint = getHintById(card.hintIds[number - 2] || -1) || {text: ''};
  var hint = getHintById(card.hintIds[number - 1]) || {text: ''};

  $hint.val('');
  $hint.val(hint.text);
  let disabled = (number !== 1 && formerhint.text === '')? 'disabled': '';

  return (
    '<div class="hint">'+
      '<button class="hintButton" '  + disabled + '>'+
        `<span style="float: left;">Hint #${number}</span>`+
        '<select style="float: right;" class="typeSelect">'+
          '<option key = "name">Name</option>'+
          '<option key = "location">Location</option>'+
          '<option key = "date">Date</option>'+
          '<option key = "time">Time</option>'+
          '<option key = "synonym">Synonym</option>'+
          '<option key = "picture">Picture</option>'+
          '<option value="etc">Etc.</option>'+
        '</select>'+
      '</button>'+
      '<div class="hintDropdown" style="">'+
        '<textarea onkeyup="updateHint(event)" id=' + `hint${number}` + ' cols="125" rows="5">'+
        '</textarea>'+
      '</div>'+
    '</div>'
  );
}

function updateCardHint() {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCardId);
  })[0] || {hints:[]};
  selectedCard.hints[0] = $('#hint1').val();
  selectedCard.hints[1] = $('#hint2').val();
  selectedCard.hints[2] = $('#hint3').val();
  selectedCard.hints[3] = $('#hint4').val();
  selectedCard.hints[4] = $('#hint5').val();
  selectedCard.hints[5] = $('#hint6').val();
  selectedCard.hints[6] = $('#hint7').val();
  selectedCard.hints[7] = $('#hint8').val();
  // console.log(selectedCard);
  renderHintList();
}



function equalsOne(id, arr = []) {
  for(var i = 0; i < arr.length; i++)
    if(Number(id) === Number(arr[i]))
      return true;
  return false;
}

function renderCardCatalogue() {
  $('#header_title').html('Card Catalogue');
  $('#header_button1').css('visibility', 'visible');
  $('#header_button2').css('visibility', 'visible');
  $('#header_button1').html('Back');
  $('#header_button2').html('Card Maker');

  var $view = $('#view');

  $view.html('');

  var deckToUse = data.decks.filter(function(deck){
    return deck.id === Number(data.selectedDeckId);
  })[0] || {cardIds:[]};

  var cardsToUse = data.cards.filter(function(card){
    return equalsOne(card.id, deckToUse.cardIds);
  });

  for(card of cardsToUse) {
      let hintsCreated = card.hintIds.reduce(function(sum, hintId){
        let hint = getHintById(hintId);
        if(hint !== '' && hint != undefined) return sum + 1;
        return sum;
      }, 0);
      $view.append(
        '<div class="deckCardDiv" onclick= setCardId(' + Number(card.id) + ')>'+
          '<div id=' + `${card.id}` + ' class="deckCard">'+
          '<div style="float:right;"><button class="xCardButton" onclick=deleteCard(event) id=' + `${card.id}`+'>x</button></div>'+
            'Term:'+
            '<br></br>'+
            `${card.term}`+
            '<br></br>'+
            'Hints Created:'+
            hintsCreated+
            '<br></br>'+
            '<button name=' + Number(card.id) + ' onclick=editCard(event)>Edit Card</button>' +
          '</div>'+
        '</div>'
      );
  }

  $view.append(
    '<div id="addCardDiv" onclick= addCard()>'+
      '<button id="addCardButton">'+
        '+'+
      '</button>'+
    '</div>'
  );

  $view.append(
    '<div class="modal">'+
      renderCardModal()+
    '</div>'
  );

};

  function callCreateTerm(){
    alert("hi");
    let selectedCard = getCard(data.selectedCardId);
    let selectedDeck = getDeckById(data.selectedDeckId);
    let term = selectedCard.term;
    if(term===""||term.length===0||term===null||term==="undefined"){
      alert("Term is blank. Please enter a term");
      return false;
    }
    console.log(selectedCard);
    console.log(selectedDeck);
    //createTerm(selectedCard,selectedDeck);
  }

  function callDeleteTerm(){
    //TODO
    console.log(selectedCard);
    console.log(selectedDeck);
  }

  function updateCategoryTerms(){

  }
