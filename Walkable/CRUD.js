

//Create section
function createCategory(value,id){ //create a new caetgory
  //alert("made it to createCategory");
  var exist = false;
  var categoryRef = rootRef.child('categories').orderByKey();
  categoryRef.once('value')
  .then(function(categoryKeys){//check if subject exist
    categoryKeys.forEach(function(snapSubjects){
      var k = snapSubjects.val();
      if(k.subject===value){
        alert("Category already exist");
        exist = true;
        return deleteDeck(id);
      }
    });
  })
  .then(function(){
    if(exist){//prevent promise
      return false;
    }
    var newCategoryKey = rootRef.child('categories').push().key
    //A category entry
    var categoryData = {
      subject: value,
      key: newCategoryKey,
      count: 0
    };
    //Write new category data
    var updates = {};
    updates['/categories/' + newCategoryKey] = categoryData;
    return rootRef.update(updates);

  },function(error){
      //something went wrong
      console.error(error);
      alert("Unable to create new category");
      return deleteDeck(id);
    });
}

function createTerm(category,term){

}

//Read section
function addDecks(){
  var categoryRef = rootRef.child('categories').orderByChild('subject');
  categoryRef.once('value')
    .then(function(snapShot){
      snapShot.forEach(function(childSnapShot){

      });
    })
    .catch(function(error){
      console.log(error.message);
    });
}
//Undo section

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

function findKey(value, id){

  var categoryRef = rootRef.child('categories').orderByChild('subject').equalTo(value).limitToFirst(1);

  categoryRef.once('value')
    .then(function(data){
      data.forEach(function(data2){
        var object = data2.val();
        removeCategory(object.key,id);
      });
    })
    .catch(function(error){
      console.log("Failed to find key " + error.message);
      });
}
