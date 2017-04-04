$(document).ready(function() {

  renderView();
  $('#header_button1').click(function() {
    switch (data.view) {
      case 1:
        data.view = 0;
        break;
      case 2:
        data.view = 1;
        break;
      case 3:
        data.view = 2;
        break;
      case 4:
        data.view = 0;
        break;
      case 5:
        data.view = 0;
        break;
      default:
        return;
    }
    renderView();
  });
  $('#header_button2').click(function() {
    switch (data.view) {
      case 1:
        if(data.selectedDeck >= 0)
          data.view = 2;
        else
          alert("You must choose a deck first");
        break;
      case 2:
          data.view = 3;
        break;
      case 3:
        data.view = 0;
        break;
      default:
        return;
    }
    renderView();
  });
  $('#view').click( function(e) {

    e.stopPropagation();

    switch (e.target.id) {
      case 'game_button':
        data.view = 4;
        break;
      case 'instructions_button':
        data.view = 5;
        break;
      case 'maker_button':
        data.view = 1;
        break;
      default:
        return;
    }

    renderView();

  });

  $('#view').on(
    'click',
    '#addDiv button',
    function(){
      addDeck();
    }
  );
  $('#view').on(
    'click',
    '.xButton',
    function(e) {
      e.stopPropagation();
      deleteDeck(this.id);
      if(data.decks.length <= 0)
        data.selectedDeck = -1;
    }
  );

  $('#view').on(
    'click',
    '#addCardDiv button',
    function(){
      addCard();
    }
  );
  $('#view').on(
    'click',
    '.xCardButton',
    function() {
      deleteCard(this.id);
    }
  );

  $('#view').on(
    'click',
    '.deckModalXButton',
    function() {
      $('.modal').css('display', 'none');
      renderDeckCollection();
    }
  );
  $('#view').on(
    'click',
    '.cardModalXButton',
    function() {
      $('.modal').css('display', 'none');
      renderView();
    }
  );
  $('#view').on(
    'click',
    '.hintButton',
    function(e) {
      e.target.nextSibling.style.display = (e.target.nextSibling.style.display === 'none')? 'block': 'none';
    }
  );

  $('#view').on(
    'click',
    '.deckCard',
    function(){
      $('.modal').css('display', 'block');
      data.selectedCard = Number(this.id);
      renderHintList();
    }
  );
  $('#view').on(
    'click',
    '.cardDiv',
    function(e){
      $('.modal').css('display', 'block');
      data.selectedDeck = Number(this.id);
      renderModal();
    }
  );
});
