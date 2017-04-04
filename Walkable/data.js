/*
  THIS IS THE DATA MODEL

  Description:
    decks are held in an array
    decks hold an id, subject and array of card ids to reference cards
    cards hold an id, term and 8 hints, the hints are either filled out or blank strings
    The hints are an array of length 8, each index holding a string

    EXAMPLE:

    var data = {
      decks: [
        {
          id: 0,
          subject: 'food groups',
          cardIds: [0, 1]
        }
      ],
      cards: [
        {
          id: 0,
          term: 'nachos',
          hints: ['','','','','','','','']
        },
        {
          id: 0,
          term: 'nachos',
          hints: ['','','','','','','','']
        }
      ]
    }
*/

var data = {
  decks: [
    {
      id: 0,
      subject: 'food groups',
      cardIds: []
    },
  ],
  cards: [],
  deckNumber: 1,
  selectedDeck: -1,
  cardNumber: 1,
  selectedCard: 0,
  view: 0,
};
