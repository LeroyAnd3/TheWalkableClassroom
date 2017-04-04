function renderModalButton() {
  return (
    '<button class="cardModalXButton">'+
      'X'+
    '</button>'
  );
}

function renderTermInput() {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCard);
  })[0] || {hints:[]};
  return (
    '<div>'+
      '<label style="display: block;">Term:</label>'+
      '<input id="termInput" onkeyup="updateCardTerm()" value="' + selectedCard.term + '"/>'+
    '</div>'
  );
}

function renderHintList() {

  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCard);
  })[0] || {hints:[]};

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
  var hints = card.hints || [];
  $hint.val('');
  $hint.val(''+hints[number-1]);
  // let display = (hints[number-1] === '' || hints[number-1] === undefined)? 'none' : 'block';
  // $hint.parent().css('display', display)
  let disabled = (hints[number-2] === '' && number > 1)? true: false;
  return (
    '<div class="hint">'+
      '<button class="hintButton">'+
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
        '<textarea onkeyup="updateCardHint('+`${card.id}`+')" id=' + `hint${number}` + ' cols="125" rows="5">'+
        '</textarea>'+
      '</div>'+
    '</div>'
  );
}

function updateCardTerm() {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCard);
  })[0] || {hints:[]};
  selectedCard.term = $('#termInput').val();
  renderHintList();
}

function updateCardHint() {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCard);
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

function addCard() {
  data.cards.push(
    {
      id: data.cardNumber,
      term: '',
      hints: ['','','','','','','','']
    }
  );
  data.selectedCard = data.cardNumber;
  var deck = data.decks.filter(function(deck){
    return deck.id === Number(data.selectedDeck);
  })[0] || {cardIds:[]};
  deck.cardIds.push(data.cardNumber);
  data.cardNumber++;
  renderCardCatalogue();
  $('.modal').css('display', 'block');
}

function deleteCard(cardId) {
  data.cards = data.cards.filter(function(card){
    return card.id !== Number(cardId);
  });
  renderCardCatalogue();
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
    return deck.id === Number(data.selectedDeck);
  })[0] || {cardIds:[]};

  var cardsToUse = data.cards.filter(function(card){
    return equalsOne(card.id, deckToUse.cardIds);
  });

  for(card of cardsToUse) {
      let hintsCreated = card.hints.reduce(function(sum, hint){
        if(hint !== '' && hint != undefined) return sum + 1;
        return sum;
      }, 0);
      $view.append(
        '<div class="deckCardDiv">'+
          '<div id=' + `${card.id}` + ' class="deckCard">'+
          '<div style="float:right;"><button class="xCardButton" id=' + `${card.id}`+'>x</button></div>'+
            'Term:'+
            '<br></br>'+
            `${card.term}`+
            '<br></br>'+
            'Hints Created:'+
            hintsCreated+
          '</div>'+
        '</div>'
      );
  }

  $view.append(
    '<div id="addCardDiv">'+
      '<button id="addCardButton">'+
        '+'+
      '</button>'+
    '</div>'
  );

  $view.append(
    '<div class="modal">'+
      '<div id="cardMaker">'+
          renderModalButton() +
          '<br></br>'+
          renderTermInput() +
          renderHintList() +
      '</div>'+
    '</div>'
  );
};
