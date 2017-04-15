
const rootRef = firebase.database().ref();

//Create section
function createCategory(value){ //create a new caetgory
  alert("made it to createCategory");
  if(value === null || value.length === 0 || value === "undefine"){
    alert("the value for category is blank");
  }
  var categoryRef = rootRef.child('categories').orderByKey();
  categoryRef.once('value').then(function(categoryKeys){//check if subject exist
    categoryKeys.forEach(function(snapSubjects){
      var k = snapSubjects.val();
      if(k.subject===category.value){
        alert("Category already exist");
        return false;
      }
    });
  }).then(function(data){
    var newCategoryKey = firebase.database().ref().child('categories').push().key
    //A category entry
    var categoryData = {
      subject: category.value,
      key: newCategoryKey
    };
    //Write new category data
    var updates = {};
    updates['/categories/' + newCategoryKey] = categoryData;
    firebase.database().ref().update(updates);
    return true;
  },function(error){
      //something went wrong
      console.error(error);
    });
}

function createTerm(category,term){

}

//Read section

//Undo section

//delete section
