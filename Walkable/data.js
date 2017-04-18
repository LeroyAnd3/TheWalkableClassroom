/*
  Author: Leroy

  Title: Data
  Description: The following is a data model for the front end view of the game
  excluding the game data

  Data = {

    decks: [
      {
        id: <number>,
        subject: <string>,
        cardIds: [<number>, <number>, ...]
      },
      ...
    ],
    selectedDeckId: <number>,

    cards: [
      {
        id: <number>,
        term: <string>,
        hintIds: [<number>, <number>, ...]
      },
      ...
    ],
    selectedCardId: <number>,

    hints: [
      {
        id: <number>,
        text: <string>
      },
      ...
    ]
  }
*/

var data = {
  decks: [],
  deckCount: 0,
  selectedDeckId: undefined,

  cards: [],
  cardCount: 0,
  selectedCardId: undefined,

  hints: [],
  hintCount: 0,

  view: 0,
};

/** HELPER FUNCTIONS **/

function equalsOne(id, arr) {
  for(var i = 0; i < arr.length; i++)
    if(arr[i] === id)
      return true;
  return false;
}

function addDeck() {
  data.decks.push({
    id: data.deckCount,
    subject: '',
    cardIds: []
  });
  data.selectedDeckId = data.deckCount;
  data.deckCount = data.deckCount + 1;
  renderDeckCollection();
  $('.modal').css('display', 'block');
}

function deleteDeck(id) {
  data.decks = data.decks.filter(function(deck) {
    return deck.selectedDeckId !== deck.id;
  });
}
function updateDeckSubject() {
  for(var i = 0; i < data.decks.length; i++)
    if(data.decks[i].id === data.selectedDeckId) {
        data.decks[i].subject = $('#subjectInput').val();
        renderModal();
    }
}
function setDeckId(id) {
  data.selectedDeckId = id;
  renderModal();
}
function submitDeck() {
  var deck = data.decks.filter(function(deck) {
    return deck.id === data.selectedDeckId
  })[0];
  var cards = data.cards.filter(function(card){
    return equalsOne(card.id, deck.cardIds)
  });
  return cards.reduce(function(C, card) {
    var hintList = card.hintIds.reduce(function (H, hintId) {
      var hint = getHint(hintId);
      H.push(hint.text);
      return H;
    }, []);
    C.push({
      term: card.term,
      hints: hintList,
      subject: getSubject(data.selectedDeckId)
    });
    return C;
  }, []);
}
function getDeckById(id) {
  return data.decks.filter(function(deck) {
    return deck.id === id;
  })[0] || {cardIds:[]};
}
function getSubject(id) {
  var deck = data.decks.filter(function(deck) {
    return deck.id === id;
  })[0];
  return deck.subject;
}

function addCard() {
  for(var i = 0; i < data.decks.length; i++)
    if(data.decks[i].id === data.selectedDeckId)
      data.decks[i].cardIds.push(data.cardCount);

  var newCard = {
    id: data.cardCount,
    term: '',
    hintIds: new Array(8)
  };

  for(var i = 0; i < newCard.hintIds.length; i++){
    newCard.hintIds[i] = data.hintCount;
    data.hints.push({
      id: data.hintCount,
      text: ''
    });
    data.hintCount = data.hintCount + 1;
  }

  data.cards.push(newCard);
  data.selectedCardId = data.cardCount;
  data.cardCount = data.cardCount + 1;
  renderCardCatalogue();
  $('.modal').css('display', 'block');
}
function deleteCard(e) {
  e.stopPropagation();
  var id = e.target.id;

  data.cards = data.cards.filter(function(card){
    return card.id !== Number(id);
  });
  card.selectedCardId = -1;
  renderCardCatalogue();
}
function updateCardTerm(id, term) {
  var selectedCard = data.cards.filter(function(card){
    return card.id === Number(data.selectedCardId);
  })[0] || {hints:[]};
  selectedCard.term = $('#termInput').val();
  renderHintList();
}
function setCardId(id) {
  data.selectedCardId = id;
  renderHintList();
}
function submitCard() {
  var card = getCard(data.selectedCardId);
  var hintList = card.hintIds.reduce(function (H, hintId) {
    var hint = getHint(hintId);
    H.push(hint.text);
    return H;
  }, []);
  return {
    term: card.term,
    hints: hintList,
    subject: getSubject(data.selectedDeckId)
  };
}
function getCard(id) {
  return data.cards.filter(function(card) {
    return card.id === id;
  })[0];
}

function updateHint(id, text) {
  for(var i = 0; i < data.hints.length; i++)
    if(data.hints[i].id === id)
      data.hints[i].text = text;
}
function getHintById(id) {
  return data.hints.filter(function(hint) {
    return hint.id === id;
  })[0];
}


//read from the database and push current decks and associated terms
addDecksFromDB(data)
  .then(function(){
    return addCardsFromDB(data);
  })
  .catch(function(error){
    console.log(error);
  });

  console.log(data);
