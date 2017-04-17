

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
        data.selectedCardId=data.deckCount;
        data.selectedCardId=data.deckCount+1;
      });
    })
    .catch(function(error){
      console.log(error.message);
    });
}
//Undo section

//delete section
function removeCategory(category,id){
  findKey(category)
         .then(function(key){
           console.log(key)
         });

  }

//helper functions
function findKey(category){
  return new Promise(function(resolve,reject){
    var categoryRef = rootRef.child('categories')
                             .orderByChild('subject')
                             .equalTo(category);
    categoryRef.once('child_added')
      .then(function(snapShot){
        return snapShot.val().key;
      })
      .catch(function(error){
        console.log("Failed to find key " + error.message);
      });
  });
}
