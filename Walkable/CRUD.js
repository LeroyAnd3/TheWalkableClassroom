const rootRef = firebase.database().ref();
const categoryRef = rootRef.child('categories');
const categoryTermsRef = rootRef.child('category-terms');
let cardnumber = 0; // the card id in the collection of cards
//Create section
function createCategory(newSubject) { //create a new category
  return new Promise(function(resolve, reject) {
    let categoryRef = rootRef.child('categories')
      .orderByChild("subject")
      .equalTo(newSubject);
    categoryRef.once('value')
      .then(function(snapShot) { //check if subject exist
        if (snapShot.exists()) {
          alert("You are making a category with the same name of another");
          //deleteDeck(id);
        }
        //A category entry
        let newCategoryKey = rootRef.child('categories').push().key;
        let categoryData = {
          subject: newSubject,
          key_category: newCategoryKey,
          count: 0
        };
        //Write new category data
        let updates = {};
        updates['/categories/' + newCategoryKey] = categoryData;
        rootRef.update(updates);
        resolve(newCategoryKey);

      }, function(error) {
        //something went wrong
        reject(error);
      });
  });
}


function createTerm(selectedCard, selectedDeck) {
  let query = categoryTermsRef
    .orderByChild("term")
    .equalTo(selectedCard.term);

  query.once('child_added')
  then(function(snapShot) {
      if (snapShot.exists()) {
        alert("This term alread exists. Please make a new one or update the existing one!");
        //deleteCard()
        return false;
      } else {
        let category_key = selectedDeck.key_category;
        let term_key = categoryTermsRef.orderByKey().equalTo(category_key).push().key;
        let hintArray = selectedCard.hintIds;
        let h1, h2, h3, h4, h5, h6, h7, h8;
        h1 = hintArray[0];
        h2 = hintArray[1];
        h3 = hintArray[2];
        h4 = hintArray[3];
        h5 = hintArray[4];
        h6 = hintArray[5];
        h7 = hintArray[6];
        h7 = hintArray[7];
        let hintList = pushHint(h1, h2, h3, h4, h5, h6, h7, h8);
        let newCard = {
          term: selectedCard.term,
          key_term: term_key,
          hint: hintList
        }
        let update = {};
        update['/category-terms/' + category_key + '/' + term_key] = newCard;
        rootRef.update(update);
      }
    })
    .catch(function(error) {
      console.log(error.message);
    });
}

//Read section
function addDecksFromDB(deckCollection) {
  return new Promise(function(resolve, reject) {
      alert("in deck from db");
      let categoryRef = rootRef.child('categories').orderByChild('subject');
      categoryRef.once('value')
        .then(function(snapShot) {
          snapShot.forEach(function(childSnapShot) {
              let k = childSnapShot.val();
              //console.log(k);
              var newDeck = new Deck(deckCollection.deckCount, k.subject, [], k.category_key);
              //console.log(newDeck);
              deckCollection.deckCount = deckCollection.deckCount + 1;
              deckCollection.$view.prepend(
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
                '</div>' +
                '</div>'
              );
              deckCollection.decks.push(newDeck);

              var domDeck = document.getElementById(`deck-${newDeck.id}`);
              domDeck.addEventListener('mousedown', self.selectDeck);

              var deckDeleteButton = document.getElementById(`delete-${newDeck.id}`);
              deckDeleteButton.addEventListener('mousedown', self.deleteDeck);

              var deckEditButton = document.getElementById(`edit-${newDeck.id}`);
              deckEditButton.addEventListener('mousedown', self.openDeckEditor);

              var deckSubmitButton = document.getElementById(`submit-${newDeck.id}`);
              deckSubmitButton.addEventListener('mousedown', self.updateDeckTerm);
              // deckSubmitButton.addEventListener('mousedown',)

              var deckCancelButton = document.getElementById(`cancel-${newDeck.id}`);
              deckCancelButton.addEventListener('mousedown', self.cancelUpdateDeckTerm);

              var addCardsButton = document.getElementById(`addCards-${newDeck.id}`);
              addCardsButton.addEventListener('mousedown', self.addCards);

              // deckCollection.decks = deckCollection.decks.map(function(deck) {
              //   deckCollection.decks.addDeck(deck);
              // });
              deckCollection.decks.addDeckButton = document.getElementById('addDeckButton');
              deckCollection.decks.addDeckButton.addEventListener('mousedown', self.addDeck);

              resolve();
            });
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }

function addCardsFromDB(selectDeck) {
    return new Promise(function(resolve, reject) {
      let query = categoryTermsRef.orderByKey().equalTo(deck.key_category);
      query.once('child_added')
        .then(function(snapShot) {
          return snapShot.forEach(function(childSnapShot) {
            deck.cardIds.push(data.cardCount);
            let hint = [];
            let k = childSnapShot.val();
            pushHint(hint, k.hint);

            let newCard = {
              id: data.cardCount,
              term: k.term,
              key_term: k.key_term,
              hintIds: new Array(8)
            };

            // for (var i = 0; i < hint.length; i++) {
            //   newCard.hintIds[i] = data.hintCount;
            //   data.hints.push({
            //     id: data.hintCount,
            //     text: hint[i]
            //   });
            //   data.hintCount = data.hintCount + 1;
            // }
            // //  console.log("Subject: " + deck.subject + ",ID: " + deck.id);
            // //  console.log(newCard.term);
            // data.cards.push(newCard);
            // data.selectedCardId = data.cardCount;
            // data.cardCount = data.cardCount + 1;
          })
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }

function getCategoryTerms(category, cardColllection) {
  return new Promise(function(resolve, reject){
    cardnumber = 0; //reset cardnumber for the next set of terms
    let query = categoryRef.orderByChild('subject').equalTo(category);
    query.once('child_added', snap => { //get key from category
      let query2 = categoryTermsRef.child(snap.key); //get terms from category
      query2.once('value', snap => {
        snap.forEach(term => {
          let card = []
          let k = term.val();
          makeCard(card, cardColllection, k.id, k.hint, k.term);
        });
        resolve();
      })
      .catch(function(error){
        reject(error);
      });
    })
      .catch(function(error){
        reject(error);
      });

  });

}

//append current categories to the concentration game to select from
function appendCategories() {
  return new Promise(function(resolve, reject) {
    categoryRef.once('value', snap => {
      snap.forEach(subject => {
        let option = document.createElement("option");
        let node = document.createTextNode(subject.val().subject);
        option.appendChild(node);
        let element = document.getElementById("categories");
        element.appendChild(option);
      });
      resolve();
    })
    .catch(function(error) {
      reject(error);
    });
  })
}

//Update section
function updateCategory(selectedDeckKey,newName) {
  return new Promise(function(resolve, reject) {
    categoryRef.orderByChild('key').equalTo(selectedDeckKey);
    categoryRef.once('child_added')
      .then(function(snapShot) {
        let k = snapShot.val();
        k.subject = newName;
        let update = {};
        update['/categories/' + selectedDeckKey] = k;
        return rootRef.update(update);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function updateCategoryTerms(selectedDeck, selectedCard) {
  let category_key = selectedDeck.key_category;
  let term_key = selectedCard.key_term;
  let hintArray = selectedCard.hintIds;
  let h1, h2, h3, h4, h5, h6, h7, h8;
  h1 = hintArray[0];
  h2 = hintArray[1];
  h3 = hintArray[2];
  h4 = hintArray[3];
  h5 = hintArray[4];
  h6 = hintArray[5];
  h7 = hintArray[6];
  h7 = hintArray[7];
  let hintList = pushHint(h1, h2, h3, h4, h5, h6, h7, h8);
  let newCard = {
    term: selectedCard.term,
    key_term: term_key,
    hint: hintList
  }
  let update = {};
  update['/category-terms/' + category_key + '/' + term_key];
  rootRef.update(update);
}

//delete section

function removeCategory(key) {
  return new Promise(function(resolve, reject) {
    let remove = {};
    remove['/categories/' + key] = null;
    remove['/category-term/' + key] = null;
    rootRef.update(remove)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject("Remove category failed: " + error.message);
      });
  });
}

function removeCategoryTerm(selectedDeck, selectedCard) {
  return new Promise(function(resolve, reject) {
    let remove = {};
    let term_key = selectedCard.key_term;
    let category_key = selectedDeck.category_key;
    remove['/category-term/' + category_key + '/' + term_key] = null;
    rootRef.update(remove)
      .then(function() {
        //deleteDeck(id);
        resolve("Remove category successful!");
      })
      .catch(function(error) {
        reject("Remove category failed: " + error.message);
      });
  });
}

//helper functions
function makeCard(card, cardArray, id, list, term) {
  card.push(cardnumber);
  cardnumber++;
  card.push(term);
  if (getHint1(list)) {
    card.push(getHint1(list));
  }
  if (getHint2(list)) {
    card.push(getHint2(list));
  }
  if (getHint3(list)) {
    card.push(getHint3(list));
  }
  if (getHint4(list)) {
    card.push(getHint4(list));
  }
  if (getHint5(list)) {
    card.push(getHint5(list));
  }
  if (getHint6(list)) {
    card.push(getHint6(list));
  }
  if (getHint7(list)) {
    card.push(getHint7(list));
  }
  if (getHint8(list)) {
    card.push(getHint8(list));
  }
  cardArray.push(card);

}

function findKey(category) {
  return new Promise(function(resolve, reject) {
    let categoryRef = rootRef.child('categories')
      .orderByChild('subject')
      .equalTo(category);
    categoryRef.once('child_added')
      .then(function(snapShot) {
        if (snapShot.exists()) {
          let key = snapShot.val().key_category;
          resolve(key);
        } else {
          reject("Could not find " + category + " key");
        }
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function pushHints(h1, h2, h3, h4, h5, h6, h7, h8) {
  var list = {
    hint1: h1,
    hint2: h2,
    hint3: h3,
    hint4: h4,
    hint5: h5,
    hint6: h6,
    hint7: h7,
    hint8: h8
  };
  return list;
}

function pushHint(hint, hintObject) {

  hint.push(getHint1(hintObject));
  hint.push(getHint2(hintObject));
  hint.push(getHint3(hintObject));
  hint.push(getHint4(hintObject));
  hint.push(getHint5(hintObject));
  hint.push(getHint6(hintObject));
  hint.push(getHint7(hintObject));
  hint.push(getHint8(hintObject));

}

function getHint1(hintObject) {
  return hintObject.hint1;
}

function getHint2(hintObject) {
  return hintObject.hint2;
}

function getHint3(hintObject) {
  return hintObject.hint3;
}

function getHint4(hintObject) {
  return hintObject.hint4;
}

function getHint5(hintObject) {
  return hintObject.hint5;
}

function getHint6(hintObject) {
  return hintObject.hint6;
}

function getHint7(hintObject) {
  return hintObject.hint7;
}

function getHint8(hintObject) {
  return hintObject.hint8;
}
