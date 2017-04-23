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
        if (!snapShot.exists()) {
          //A category entry
          let newCategoryKey = rootRef.child('categories').push().key;
          let categoryData = {
            subject: newSubject,
            key_category: newCategoryKey
          };
          //Write new category data
          let updates = {};
          updates['/categories/' + newCategoryKey] = categoryData;
          rootRef.update(updates);
          resolve(newCategoryKey);
        }
        alert("This deck already exists. Please change the name of the deck");
        reject(new Error("Deck already exists"));
      })
      .catch(function(error) {
        //something went wrong
        reject(error);
      });
  });
}

function createTerm(newTerm, selectedDeckKey) {
  return new Promise(function(resolve,reject){
    let query = categoryTermsRef.child(selectedDeckKey).orderByChild('term').equalTo(newTerm);
    query.once('value')
      .then(function(snapShot){
        if(!snapShot.exists()){
          let newTermKey = categoryTermsRef.child(selectedDeckKey).push().key;
          let newCard = {
            term:newTerm,
            key_term:newTermKey,
            hint:{
              hint1:'',
              hint2:'',
              hint3:'',
              hint4:'',
              hint5:'',
              hint6:'',
              hint7:'',
              hint8:''
            }
          };
          let update = {};
          update["/category-terms/"+selectedDeckKey+"/"+newTermKey]=newCard;
          rootRef.update(update);
          resolve(newTermKey);

        }else{
          alert("This card already exist.");
          reject(new Error("This card already exist"));
        }
      })
      .catch(function(error){
        reject(error);
      });
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
              var newDeck = new Deck(deckCollection.deckCount, k.subject, [], k.key_category);
              deckCollection.addDeck(newDeck);
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
      let query = categoryTermsRef.orderByKey().equalTo(selectDeck.category_key);
      query.once('child_added')
        .then(function(snapShot) {
          return snapShot.forEach(function(childSnapShot) {
            let hint = [];
            let k = childSnapShot.val();
            pushHint(hint, k.hint);

            let newCard = {
              id: selectDeck.cardCount,
              term: k.term,
              hints: hint,
              key_term: k.key_term
            };
            //console.log(newCard);
            //console.log(selectDeck.cardCount);
            selectDeck.addCard(newCard);
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
          });
          resolve();
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
      reject(new Error("Failed to append categories: " + error.message));
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
        reject(new Error("Failed to update deck: " + error.message));
      });
  });
}

function updateTerm(newTerm,deckKey, termKey) {
  return new Promise(function (resolve,reject){
    let query = categoryTermsRef.child(deckKey).orderByChild('key_term').equalTo(termKey);
    query.once('child_added')
      .then(function(snapShot){
        if(!snapShot.exists())
          reject(new Error("Term key does not exist in DB: " + termKey));
        let k = snapShot.val();
        k.term = newTerm;
        let update = {};
        update['/category-terms/' + deckKey + '/' + termKey]=k;
        rootRef.update(update);
        resolve();
      })
      .catch(function(error){
        reject(new Error("Failed to update term: " + error.message));
      });

  });

}

function updateHints(deckKey,termKey,hintArray){
  return new Promise(function(resolve, reject) {
    console.log(deckKey);
    console.log(termKey);
    console.log(hintArray);
    let query = categoryTermsRef.child(deckKey).orderByChild('key_term').equalTo(termKey);
    query.once('child_added')
      .then(function(snapShot){
        let k = snapShot.val();
        let hint = pushHints(hintArray);
        k.hint = hint;
        let update = {};
        update['/category-terms/' + deckKey + '/' + termKey]=k;
        rootRef.update(update);
        resolve("successfully updated hints");
      })
      .catch(function(error){
        reject(new Error("Failed to update hint: " + error.message));
      });
  });
}
//delete section

function removeCategory(key) {
  return new Promise(function(resolve, reject) {
    let remove = {};
    remove['/categories/' + key] = null;
    remove['/category-terms/' + key] = null;
    rootRef.update(remove)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject(new Error("Remove category failed: " + error.message));
      });
  });
}

function removeTerm(deckKey, termKey) {
  return new Promise(function(resolve, reject) {
    let remove = {};
    remove['/category-terms/' + deckKey + '/' + termKey] = null;
    rootRef.update(remove)
      .then(function() {
        resolve("Remove category successful!");
      })
      .catch(function(error) {
        reject(new Error("Failed to remove term: " + error.message));
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

function pushHints(hintArray) {
  var list = {
    hint1: hintArray[0],
    hint2: hintArray[1],
    hint3: hintArray[2],
    hint4: hintArray[3],
    hint5: hintArray[4],
    hint6: hintArray[5],
    hint7: hintArray[6],
    hint8: hintArray[7]
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
