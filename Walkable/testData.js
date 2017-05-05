class ViewManager {
  constructor() {
    this.view = 5;
    this.updateView = function(e) {
      let id = Number(e.target.value);
      for(var i = 1; i <= 8; i++)
        if (i === id)
          $(`#view-${id}`).toggleClass('hidden')
        else
          $(`#view-${i}`).addClass('hidden');
    }
    this.$view1 = $('#view-1');
    this.$view2 = $('#view-2');
    this.$view3 = $('#view-3');
    this.$view4 = $('#view-4');
    this.$view5 = $('#view-5');
    this.$view6 = $('#view-6');
    this.$view7 = $('#view-7');
    this.$view8 = $('#view-8');

    this.button1 = document.getElementById('button-1');
    this.button2 = document.getElementById('button-2');
    this.button3 = document.getElementById('button-3');
    this.button4 = document.getElementById('button-4');
    this.button5 = document.getElementById('button-5');
    this.button6 = document.getElementById('button-6');
    this.button7 = document.getElementById('button-7');
    this.button8 = document.getElementById('button-8');

    this.button1.addEventListener('mousedown', this.updateView);
    this.button2.addEventListener('mousedown', this.updateView);
    this.button3.addEventListener('mousedown', this.updateView);
    this.button4.addEventListener('mousedown', this.updateView);
    this.button5.addEventListener('mousedown', this.updateView);
    this.button6.addEventListener('mousedown', this.updateView);
    this.button7.addEventListener('mousedown', this.updateView);
    this.button8.addEventListener('mousedown', this.updateView);
    $(`#view-${this.view}`).removeClass('hidden');
  }
};
let viewmanager = new ViewManager();

function Card(id, term, hints=[], key_term, category_key){
  var self = this;
  this.id = id;
  this.term = term;
  this.hints = hints;
  this.key_term = key_term;
  this.category_key = category_key;
}

function Deck(id, subject, cards, category_key) {
  self = this;
  self.id = id;
  self.subject = subject;
  self.cards = cards;
  self.category_key = category_key;
  self.cardCount = 0;
  self.selectedCard = null;
  self.$view = $('#view-6');
  this.$view = $('#view-6');

  self.renderButton = function() {
    this.$view.append(
      '<div class="card" style="background: #F5F5F5;">' +
        '<br>Want to create<br>a new card?<br>' +
        '<button id="addCardButton" class="addCardButton">Click to Create</button>' +
      '</div>'
    );
  }.bind(this);

  self.renderCard = function(card) {
    this.$view.prepend(
      `<div id=card-${card.id} class="card">` +
        `<button id="deleteCard-${card.id}" class="cardDeleteButton">x</button>`+
        `<input id=inputCard-${card.id} size=12 class="hidden"></input><br>` +
        `<span>Card #${card.id}</span><br>` +
        `<span id=term-${card.id} >${card.term || "Add Term"}</span><br>` +
        `<button id=editCardTerm-${card.id}>Term</button>` +
        `<button id=editCardHints-${card.id}>Hints</button>` +
        `<button id=updateCardTerm-${card.id} class="hidden">Update</button>` +
        `<button id=cancelCardTerm-${card.id} class="hidden">Cancel</button>` +
      `</div>`
    );
    var domCard = document.getElementById(`card-${card.id}`);
    domCard.addEventListener('click', this.selectCard);

    var editButton = document.getElementById(`editCardTerm-${card.id}`);
    editButton.addEventListener('click', this.openCardTermEditor);

    var hintsButton = document.getElementById(`editCardHints-${card.id}`);
    hintsButton.addEventListener('click', this.openHintView);

    var updateTermButton = document.getElementById(`updateCardTerm-${card.id}`);
    updateTermButton.addEventListener('click', this.updateCardTerm);

    var cancelUpdateTermButton = document.getElementById(`cancelCardTerm-${card.id}`);
    cancelUpdateTermButton.addEventListener('click', this.cancelUpdateCardTerm);


    //Deletion doesn't bind to event listener well, so just adding it to the selectCard method as edge case
  }.bind(this);

  self.getCardId = function(string) {
    return Number(string.split('-')[1]);
  }.bind(this);

  self.getCardById = function(id) {
    return this.cards.filter(function(card) {
      return card.id === id;
    })[0];
  }.bind(this);

  self.selectCard = function(e) {
    e.stopPropagation();
    var id = this.getCardId(e.target.id);
    var card = this.getCardById(id);
    var $clickedCard = $(`#card-${id}`);

    //Handle deletion logic here because of strange bug in event listener code
    if( e.target.id === `deleteCard-${id}`) {
      // console.log(card);
      // console.log(this.cards);
      removeTerm(card.category_key,card.key_term)
      .then(function(){
        $(`#card-${id}`).removeClass('selected');
        $(`#card-${id}`).remove();

        this.cards = this.cards.filter(function(card) {
          return card.id !== id;
        });

        return;
      })
      .catch(function(error){
        console.log(error);
      });
    return;
    }
    $clickedCard.addClass('selected');

    this.selectedCard = this.cards.filter(function(card) {
      if(card.id === id)
        return true;
      else {
        $(`#card-${card.id}`).removeClass('selected');
      }
    })[0];
  }.bind(this);

  self.toggleCardTermEditorView = function(id, toggleOpen) {
    var $termInput = $(`#inputCard-${id}`);
    var $term = $(`#term-${id}`);
    var $editTermButton = $(`#editCardTerm-${id}`);
    var $editHintsButton = $(`#editCardHints-${id}`);
    var $termUpdateButton = $(`#updateCardTerm-${id}`);
    var $cancelButton = $(`#cancelCardTerm-${id}`);

    if(toggleOpen) {
      $termInput.removeClass('hidden');
      $termUpdateButton.removeClass('hidden');
      $cancelButton.removeClass('hidden');
      $term.addClass('hidden');
      $editTermButton.addClass('hidden');
      $editHintsButton.addClass('hidden');
    } else {
      $termInput.addClass('hidden');
      $termUpdateButton.addClass('hidden');
      $cancelButton.addClass('hidden');
      $term.removeClass('hidden');
      $editTermButton.removeClass('hidden');
      $editHintsButton.removeClass('hidden');
    }
  }.bind(this);

  self.openCardTermEditor = function(e) {
    e.stopPropagation();
    var id = this.getCardId(e.target.id);

    this.toggleCardTermEditorView(id, true);
  }.bind(this);

  self.updateCardTerm = function(e) {
    e.stopPropagation();
    var id = this.getCardId(e.target.id);
    var card = this.getCardById(id);
    this.toggleCardTermEditorView(id, false);
    console.log(this.cards);
    var $termInput = $(`#inputCard-${id}`);
    var $term = $(`#term-${id}`);
    var newTerm = $termInput.val();
    $termInput.val('');


      updateTerm(newTerm, card.category_key,card.key_term)
        .then(function() {
          card.term = newTerm;
          $term.html(newTerm);
        })
        .catch(function(error) {
          console.log(error)
        });

  }.bind(this);

  self.cancelUpdateCardTerm = function(e) {
    e.stopPropagation();
    var id = this.getCardId(e.target.id);

    this.toggleCardTermEditorView(id, false);

    $(`#inputCard-${id}`).val('');
  }.bind(this);

  self.openHintView = function(e) {
    this.selectCard(e);

    var card = this.selectedCard;
    card.hints = (card.hints.length > 0)? card.hints : new Array(8);

    $('#hint-1').val(card.hints[0]);
    $('#hint-2').val(card.hints[1]);
    $('#hint-3').val(card.hints[2]);
    $('#hint-4').val(card.hints[3]);
    $('#hint-5').val(card.hints[4]);
    $('#hint-6').val(card.hints[5]);
    $('#hint-7').val(card.hints[6]);
    $('#hint-8').val(card.hints[7]);

    viewmanager.updateView({
      target: {value:7}
    });
  }.bind(this);

  self.emptyView = function() {
    this.$view.empty();
  }.bind(this)

  self.updateHints = function() {
    var card = this.selectedCard;
    //console.log(card);
    card.hints = new Array(8);

    card.hints[0] = $('#hint-1').val();
    card.hints[1] = $('#hint-2').val();
    card.hints[2] = $('#hint-3').val();
    card.hints[3] = $('#hint-4').val();
    card.hints[4] = $('#hint-5').val();
    card.hints[5] = $('#hint-6').val();
    card.hints[6] = $('#hint-7').val();
    card.hints[7] = $('#hint-8').val();

    updateHints(card.category_key,card.key_term,card.hints)
    .then(function(){
      viewmanager.updateView({
        target: {value:6}
      });
    })
    .catch(function(error){
      alert("Unable to update hints");
      console.log(error);
    });


  }.bind(this)

  self.cancelUpdateHints = function() {
    viewmanager.updateView({
      target: {value:6}
    });
  }.bind(this);

  self.doesntExist = function(newCard, cards) {
    for (var i = 0; i < cards.length; i++) {
      if(cards[i].key_term === newCard.key_term)
        return false;
    }
    return true;
  };

  self.addCard = function(potentialCard) {
    var theCurrentDeck = this;
    var newCard = {
      id: theCurrentDeck.cardCount,
      term: '',
      hints: [],
      key_term: '',
      category_key: theCurrentDeck.category_key
    };

    if(typeof potentialCard === 'object' && typeof potentialCard.id === 'number'){
      newCard = potentialCard;
      console.log(newCard);
      // theCurrentDeck.cards.push(newCard);
      // theCurrentDeck.cardCount = theCurrentDeck.cardCount + 1;
      //
      // console.log(
      //   {
      //     deckSubject: theCurrentDeck.subject,
      //     cardCount: theCurrentDeck.cardCount,
      //     theCurrentDeck
      //   }
      // );
      //
      // theCurrentDeck.renderCard(newCard);
    }else{
      createTerm(newCard.category_key)
        .then(function(newCardKey){
          newCard.key_term = newCardKey;

          if(self.doesntExist(newCard, theCurrentDeck.cards)) {
            theCurrentDeck.cards.push(newCard);
            theCurrentDeck.cardCount = theCurrentDeck.cardCount + 1;
            theCurrentDeck.renderCard(newCard);
          }

        })
        .catch(function(error){
          console.log(error);
          return false;
        });
    }
    // console.log(newCard);
    if(newCard.key_term !== "") {
      theCurrentDeck.cards.push(newCard);
      theCurrentDeck.cardCount = theCurrentDeck.cardCount + 1;
      theCurrentDeck.renderCard(newCard);
    }

  }.bind(this);

  self.cards = cards.map(function(card) {
    self.addCard(card);
  });

}


function DeckCollection(decks=[]) {
  var self = this;
  self.decks = [];
  self.selectedDeck = null;
  self.deckCount = 0;
  self.$view = $('#view-5');

  self.setSelectedDeck = function(deckToSet) {
    self.selectedDeck = deckToSet;
  }

  self.getDeckId = function(string) {
    return Number(string.split('-')[1]);
  }

  self.getDeckById = function(id) {
    return self.decks.filter(function(deck) {
      return deck.id === id;
    })[0];
  }

  self.selectDeck = function(e) {
    var clickedDeck = e.target;
    var id = self.getDeckId(clickedDeck.id);
    var $clickedDeck = $(`#deck-${id}`);

    $clickedDeck.addClass('selected');

    self.selectedDeck = self.decks.filter(function (deck) {
      if( deck.id === id ) {
        return true;
      } else {
        $(`#deck-${deck.id}`).removeClass('selected');
      }
    })[0];
  }

  self.deleteDeck = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(this.id);
    let deck = self.getDeckById(id);
    if(deck.category_key!=''){
      removeCategory(deck.category_key)
      .catch(function(error){
        alert("unable to delete deck");
        console.log(error);
        return false;
      });
    }

    $(`#deck-${id}`).removeClass('selected');
    $(this).parents().eq(3).remove();

    self.decks = self.decks.filter(function(deck) {
    return deck.id !== id;
    });
  };

  self.toggleDeckEditor = function(id, toggleOpen) {
    var $subjectTitle = $(`#subject-${id}`);
    var $inputArea = $(`#input-${id}`);
    var $editButton = $(`#edit-${id}`);
    var $addCardsButton = $(`#addCards-${id}`);
    var $submitButton = $(`#submit-${id}`);
    var $cancelButton = $(`#cancel-${id}`);

    if(toggleOpen) {
      $subjectTitle.addClass('hidden');
      $inputArea.removeClass('hidden');
      $editButton.addClass('hidden');
      $addCardsButton.addClass('hidden');
      $submitButton.removeClass('hidden');
      $cancelButton.removeClass('hidden');
      $inputArea.val($subjectTitle.html());
    } else {
      $subjectTitle.removeClass('hidden');
      $inputArea.addClass('hidden');
      $editButton.removeClass('hidden');
      $addCardsButton.removeClass('hidden');
      $submitButton.addClass('hidden');
      $cancelButton.addClass('hidden');
    }
  }

  self.updateDeckTerm = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(e.target.id);
    var deck = self.getDeckById(id);

    self.toggleDeckEditor(id, false);

    var $subjectTitle = $(`#subject-${id}`);
    var $inputArea = $(`#input-${id}`);
    var newSubject = $inputArea.val();
    $inputArea.val('');

    if (deck.category_key.length != 0) {
      // console.log("key exist, update category");
      // console.log("Deck key before update and being sent to updateCategory() " + deck.category_key);
      updateCategory(deck.category_key, newSubject)
        .then(function() {
          self.decks.map(function(deck) {
            if (id === deck.id) {
              deck.subject=newSubject;
              $subjectTitle.html(newSubject);
            }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      createCategory(newSubject)
        .then(function(category_key) {
          self.decks.map(function(deck) {
            if (id === deck.id) {
              deck.subject=newSubject;
              deck.category_key=category_key;
              $subjectTitle.html(newSubject);
            }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  self.cancelUpdateDeckTerm = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(e.target.id);

    self.toggleDeckEditor(id, false);

    var $inputArea = $(`#input-${id}`);
    $inputArea.val('');
  };

  self.openDeckEditor = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(e.target.id);

    self.selectedDeck = self.decks.filter(function(deck) {
      if(deck.id === id) {
        $(`#deck-${deck.id}`).addClass('selected');
        return true;
      } else {
        $(`#deck-${deck.id}`).removeClass('selected');
      }
    })[0];

    self.toggleDeckEditor(id, true);

  };

  self.addCards = function(e) {
    e.stopPropagation();
    var id = self.getDeckId(e.target.id);

    self.selectedDeck = self.decks.filter(function(deck) {
      if(deck.id === id) {
        $(`#deck-${deck.id}`).addClass('selected');
        return true;
      }
      else  {
        $(`#deck-${deck.id}`).removeClass('selected');
        return false
      }
    })[0];
    var deck = self.selectedDeck;

    deck.emptyView();
    for(card of deck.cards) {
      deck.renderCard(card);
    }
    deck.renderButton();

    self.addCardButton = document.getElementById(`addCardButton`);
    self.addCardButton.addEventListener('click', self.addCard);

    self.updateHintsButton = document.getElementById('updateHintsButton');
    self.updateHintsButton.addEventListener('click', self.updateHints);

    self.cancelUpdateHintsButton = document.getElementById('cancelUpdateHintsButton');
    self.cancelUpdateHintsButton.addEventListener('click', self.cancelUpdateHints)

    viewmanager.updateView({
      target: {value:6}
    });
  };

  self.addCard = function(e) {
    self.selectedDeck.addCard();
  }.bind(this);

  self.updateHints = function(e) {
    self.selectedDeck.updateHints();
  }

  self.cancelUpdateHints = function(e) {
    self.selectedDeck.cancelUpdateHints();
  }

  self.addDeck = function(potentialDeck) {
    var newDeck = new Deck(self.deckCount, '', [], '');
    if(typeof potentialDeck === 'object' && typeof potentialDeck.id === 'number'){
      newDeck = potentialDeck;
    }
    self.deckCount = self.deckCount + 1;

    self.$view.prepend(
      `<div class="deckStack">` +
        '<div class="card1">' +
          '<div class="card2">' +
            `<div id=deck-${newDeck.id} class="card3">` +
              `<div id=deleteDeck-${newDeck.id} class="deckDeleteButton">x</div><br>` +
              '<br>' +
              `<span id=subject-${newDeck.id} >${newDeck.subject || "Add Subject"}</span><br>` +
              `<input id=input-${newDeck.id} size=12 class="hidden"></input><br>` +
              `<button id=edit-${newDeck.id} class="editButton">Edit</button>` +
              `<button id=addCards-${newDeck.id} value=6 class="addCardsButton">Add Cards</button>` +
              `<button id=submit-${newDeck.id} class="submitButton hidden">Submit</button>` +
              `<button id=cancel-${newDeck.id} class="cancelButton hidden">Cancel</button>` +
          '  </div>' +
          '</div>' +
        '</div>'+
      '</div>'
    );
    self.decks.push(newDeck);

    var domDeck = document.getElementById(`deck-${newDeck.id}`);
    domDeck.addEventListener('click', self.selectDeck);

    var deckDeleteButton = document.getElementById(`deleteDeck-${newDeck.id}`);
    deckDeleteButton.addEventListener('click', self.deleteDeck);

    var deckEditButton = document.getElementById(`edit-${newDeck.id}`);
    deckEditButton.addEventListener('click', self.openDeckEditor);

    var deckSubmitButton = document.getElementById(`submit-${newDeck.id}`);
    deckSubmitButton.addEventListener('click', self.updateDeckTerm);

    var deckCancelButton = document.getElementById(`cancel-${newDeck.id}`);
    deckCancelButton.addEventListener('click', self.cancelUpdateDeckTerm);

    var addCardsButton = document.getElementById(`addCards-${newDeck.id}`);
    addCardsButton.addEventListener('click', self.addCards);
  };

  self.decks = decks.map(function(deck) {
    self.addDeck(deck);
  });
  self.addDeckButton = document.getElementById('addDeckButton');
  self.addDeckButton.addEventListener('click', self.addDeck);
}

let deckcollection = new DeckCollection();

addDecksFromDB(deckcollection)
  .then(function(){
    deckcollection.decks.forEach(function(deckToSelect){
      deckcollection.setSelectedDeck(deckToSelect);
      addCardsFromDB(deckcollection.selectedDeck);
    });
  }).then(function(){
    // console.log(deckcollection);
    // console.log(deckcollection.decks);
  })
  .catch(function(error){
    console.log(error);
  });
