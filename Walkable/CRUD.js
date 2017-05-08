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
        }else{
          alert("This deck already exists. Please change the name of the deck");
          reject(new Error("Deck already exists"));
        }

      })
      .catch(function(error) {
        //something went wrong
        reject(error);
      });
  });
}

function createTerm(selectedDeckKey) {
  return new Promise(function(resolve,reject){
    console.log(selectedDeckKey);
    //console.log(newCard);
    let query = categoryRef.orderByKey().equalTo(selectedDeckKey);
    query.once('value')
      .then(function(snapShot){
        //console.log(snapShot.val());
        if(snapShot.exists()){
          let newTermKey = categoryTermsRef.child(selectedDeckKey).push().key;
          console.log("pushing key to categoryTermsRef");
          console.log(newTermKey);
          let newCard = {
            term:'',
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
          //console.log("before update");
          let update = {};
          update["/category-terms/"+selectedDeckKey+"/"+newTermKey]=newCard;
          rootRef.update(update);
          resolve(newTermKey);
        }else{
          alert("unable to make new card");
          reject(new Error("Could not find the deck in the DB. Check query"));
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
      //console.log(selectDeck);
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
              key_term: k.key_term,
              category_key: selectDeck.category_key
            };

            selectDeck.addCard(newCard);
          });
          resolve();
        })
        .catch(function(error) {
          reject(new Error("Failed to load cards from DB: " + error.message));
        });
    });
  }

function getCategoryTerms(category, cardColllection, imageCollection,audioCollection) {
  return new Promise(function(resolve, reject){
    cardnumber = 0; //reset cardnumber for the next set of terms
    let query = categoryRef.orderByChild('subject').equalTo(category);
    query.once('child_added', snap => { //get key from category
      let query2 = categoryTermsRef.child(snap.key); //get terms from category
      query2.once('value', snap => {
        snap.forEach(term => {
          let card = []
          let k = term.val();
          if(k.term!=""){
            makeCard(card,cardColllection,imageCollection,audioCollection,k.id, k.hint, k.term);
          }
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
    categoryRef.on('value', snap => {
      clearMenu();
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
  console.log("this is the key for the selected deck: "+ selectedDeckKey);
  let ref = rootRef.child('/categories/' + selectedDeckKey);
  return new Promise(function(resolve, reject) {
    ref.once('value')
      .then(function(snapShot){
        if(!snapShot.exists()){
          alert("Could not update deck name");
          //console.log(snapShot.val());
          reject(new Error("unable to find deck in DB"));
        }else{
          let k = snapShot.val();
          k.subject = newName;
          let update = {};
          update['/categories/' + selectedDeckKey] = k;
          rootRef.update(update);
          resolve();
        }
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
function makeCard(card, cardCollection,imageCollection,audioCollection, id, hint, term) {
  card.push(cardnumber);
  let hintCount = 0;
  cardnumber++;
  card.push(term);
  if (getHint1(hint)) {
    card.push(getHint1(hint));
    hintCount++;
  }
  if (getHint2(hint)) {
    card.push(getHint2(hint));
    hintCount++;
  }
  if (getHint3(hint)) {
    card.push(getHint3(hint));
    hintCount++;
  }
  if (getHint4(hint)) {
    card.push(getHint4(hint));
    hintCount++;
  }
  if (getHint5(hint)) {
    card.push(getHint5(hint));
    hintCount++;
  }
  if (getHint6(hint)) {
    card.push(getHint6(hint));
    hintCount++;
  }
  if (getHint7(hint)) {
    card.push(" AUDIO CARD ");
    audioCollection[term]=getHint7(hint);
    hintCount++;
  }
  if (getHint8(hint)) {
    card.push(" IMAGE CARD ");
    imageCollection[term]=getHint8(hint);
    hintCount++;
  }
  if(hintCount>1){
    cardCollection.push(card);
  }


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

function clearMenu(){
    let element = document.getElementById("categories");
    let i;
    for(i = element.options.length - 1 ; i >= 0 ; i--)
    {
        element.remove(i);
    }

}
