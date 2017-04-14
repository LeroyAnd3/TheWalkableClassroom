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
  data.deckCount = data.deckCount + 1;
}
function deleteDeck(id) {
  data.decks = data.decks.filter(function(deck) {
    return deck.selectedDeckId !== deck.id;
  });
}
function updateDeck(id, subject) {
  for(var i = 0; i < data.decks.length; i++)
    if(data.decks[i].id === id)
      data.decks[i].subject = subject;
}
function setDeckId(id) {
  data.selectedDeckId = id;
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
  data.cardCount = data.cardCount + 1;
}
function deleteCard(id) {
  data.cards = data.cards.filter(function(card) {
    return card.selectedCardId !== card.id;
  });
}
function updateCard(id, term) {
  for(var i = 0; i < data.cards.length; i++)
    if(data.cards[i].id === id)
      data.cards[i].term = term;
}
function setCardId(id) {
  data.selectedCardId = id;
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
function getHint(id) {
  return data.hints.filter(function(hint) {
    return hint.id === id;
  })[0];
}
