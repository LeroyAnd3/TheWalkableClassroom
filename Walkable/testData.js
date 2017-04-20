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

function Deck(id, subject, cardIds) {

  this.id = id;
  this.subject = subject;
  this.cardIds = cardIds;

  this.deleteButton = null;;

  this.setId = function(id) { this.id = id; };
  this.setSubject = function(subject) { this.subject = subject; };
  this.addCardId = function(cardId) { this.cardIds.push(cardId); };
  this.deleteCardId = function(cardId) {
    this.cardIds = this.cardIds.filter(function(id) { return id !== cardId });
  };
  this.getCardIds = function() { return cardIds; }
  this.setDeleteButton = function(deleteButton, func) {
    this.deleteButton = document.getElementById(`deck-${id}`);
    this.deleteButton.addEventListener('mousedown', func);
  }

}


function DeckCollection(decks=[]) {
  var self = this;
  self.decks = [];
  self.selectedDeck = null;
  self.deckCount = 0;
  self.$view = $('#view-5');

  self.toggleDeckSelect = function(element) {
    element.toggleClass('selected');
  }

  self.getDeckId = function(string) {
    return Number(string.split('-')[1]);
  }

  self.selectDeck = function(e) {
    let clickedDeck = this;
    let id = self.getDeckId(clickedDeck.id);
    var $clickedDeck = $(clickedDeck);

    $clickedDeck.toggleClass('selected');

    if($clickedDeck.hasClass('selected')){
      self.selectedDeck = self.decks.filter(function(deck) {
        if(deck.id === id)
          return true;
        else {
          $(`#deck-${deck.id}`).removeClass('selected');
        }
      })[0];
    } else {
      self.selectedDeck = null;
    }

  }

  self.deleteDeck = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(this.id);
    $(`#deck-${id}`).removeClass('selected');
    $(this).parents().eq(3).remove();
    self.decks = self.decks.filter(function(deck) {
      return deck.id !== id;
    });
  };

  self.updateDeckTerm = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(this.id);

    var edit = $(`#edit-${id}`);
    var addCardsButton = $(`#addCards-${id}`);
    var subject = $(`#subject-${id}`);
    var input = $(`#input-${id}`);
    var submitButton = $(`#submit-${id}`);
    var cancelButton = $(`#cancel-${id}`);

    edit.removeClass('hidden');
    addCardsButton.removeClass('hidden');
    subject.removeClass('hidden');
    input.addClass('hidden');
    submitButton.addClass('hidden');
    cancelButton.addClass('hidden');

    var newSubject = input.val();
    input.val('');

    self.decks.map(function(deck) {
      if(id === deck.id){
        deck.setSubject(newSubject);
        subject.html(newSubject);
      }
    });

  };

  self.cancelUpdateDeckTerm = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(this.id);

    var edit = $(`#edit-${id}`);
    var addCardsButton = $(`#addCards-${id}`);
    var subject = $(`#subject-${id}`);
    var input = $(`#input-${id}`);
    var submitButton = $(`#submit-${id}`);
    var cancelButton = $(`#cancel-${id}`);

    edit.removeClass('hidden');
    addCardsButton.removeClass('hidden');
    subject.removeClass('hidden');
    input.addClass('hidden');
    submitButton.addClass('hidden');
    cancelButton.addClass('hidden');

    input.val('');
  };

  self.openDeckEditor = function(e) {
    e.stopPropagation();
    let id = self.getDeckId(this.id);

    var edit = $(`#edit-${id}`);
    var addCardsButton = $(`#addCards-${id}`);
    var subject = $(`#subject-${id}`);
    var input = $(`#input-${id}`);
    var submitButton = $(`#submit-${id}`);
    var cancelButton = $(`#cancel-${id}`);

    edit.addClass('hidden');
    addCardsButton.addClass('hidden');
    subject.addClass('hidden');
    input.removeClass('hidden');
    submitButton.removeClass('hidden');
    cancelButton.removeClass('hidden');

    input.val(String(subject.html()));
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
    });

    viewmanager.updateView({
      target: {value:6}
    })
  };

  self.addDeck = function() {
    var newDeck = new Deck(self.deckCount, '', []);
    self.deckCount = self.deckCount + 1;

    self.$view.prepend(
      `<div class="deckStack">` +
        '<div class="card1">' +
          '<div class="card2">' +
            `<div id=deck-${newDeck.id} class="card3">` +
              `<div id=delete-${newDeck.id} class="deckDeleteButton">x</div><br>` +
              '<br>' +
              `<span id=subject-${newDeck.id} >${newDeck.subject || "'Please Add Subject'"}</span><br>` +
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
    domDeck.addEventListener('mousedown', self.selectDeck);

    var deckDeleteButton = document.getElementById(`delete-${newDeck.id}`);
    deckDeleteButton.addEventListener('mousedown', self.deleteDeck);

    var deckEditButton = document.getElementById(`edit-${newDeck.id}`);
    deckEditButton.addEventListener('mousedown', self.openDeckEditor);

    var deckSubmitButton = document.getElementById(`submit-${newDeck.id}`);
    deckSubmitButton.addEventListener('mousedown', self.updateDeckTerm);

    var deckCancelButton = document.getElementById(`cancel-${newDeck.id}`);
    deckCancelButton.addEventListener('mousedown', self.cancelUpdateDeckTerm);

    var addCardsButton = document.getElementById(`addCards-${newDeck.id}`);
    addCardsButton.addEventListener('mousedown', self.addCards);
  };

  self.decks = decks.map(function(deck) {
    self.addDeck(deck);
  });
  self.addDeckButton = document.getElementById('addDeckButton');
  self.addDeckButton.addEventListener('mousedown', self.addDeck);
}

let deckcollection = new DeckCollection();
