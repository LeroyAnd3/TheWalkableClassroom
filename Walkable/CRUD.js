

//Create section
function createCategory(value,id){ //create a new category
  var categoryRef = rootRef.child('categories')
                           .orderByChild("subject")
                           .equalTo(value);
  categoryRef.once('value')
  .then(function(snapShot){//check if subject exist
    if(snapShot.exists()){
      alert("This category already exist");
      deleteDeck(id);
    }else{
      //A category entry
      var newCategoryKey = rootRef.child('categories').push().key;
      var categoryData = {
        subject: value,
        key:newCategoryKey,
        count: 0
      };
      //Write new category data
      var updates = {};
      updates['/categories/' + newCategoryKey] = categoryData;
      return rootRef.update(updates);
    }
  },function(error){
      //something went wrong
      console.error(error);
      alert("Unable to create new category");
      deleteDeck(id);
    });
}

function createTerm(category,term){

}

//Read section
function addDecksFromDB(data){
  var categoryRef = rootRef.child('categories').orderByChild('subject');
  categoryRef.once('value')
    .then(function(snapShot){
      snapShot.forEach(function(childSnapShot){
        var k = childSnapShot.val();
        data.decks.push({
          id:data.deckCount,
          subject:k.subject,
          cardIds:[]
        });
        console.log(data.deckCount);
        data.selectedDeckId=data.deckCount;
        data.deckCount=data.deckCount+1;
      });
    })
    .catch(function(error){
      console.log(error.message);
    });
}
//Undo section

//delete section
//delete section
function removeCategory(key,id){

    var categoryRef = firebase.database().ref('categories/'+key);
    var categoryTermsRef = firebase.database().ref('category-terms/'+key);

    categoryRef.remove()
      .then(function(){
        console.log("Remove category successful!");
        deleteDeck(id);
      })
      .catch(function(error){
        console.log("Remove category failed: " + error.message);
      });

      categoryTermsRef.remove()
        .then(function(){
          console.log("Remove caetgory-terms successful!");
        })
        .catch(function(error){
          console.log("Remove category-term failed: " + error.message);
        });

  }

//helper functions

function findKey(value,call ,id){
  var categoryRef = rootRef.child('categories')
                           .orderByChild('subject')
                           .equalTo(value)
                           .limitToFirst(1);

  categoryRef.once('child_added')
    .then(function(data){
      switch(call){
        case 0:
          removeCategory(data.val().key,id);
          break;
      }
    })
    .catch(function(error){
      console.log("Failed to find key " + error.message);
      });
}
