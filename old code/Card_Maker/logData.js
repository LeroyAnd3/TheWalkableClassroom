
'use strict'
$(document).ready(function(){
  //Shortcuts to DOM Element
  var category = document.getElementById('category');
  var answer = document.getElementById('answer');
  var hint1 = document.getElementById('hint1');
  var hint2 = document.getElementById('hint2');
  var hint3 = document.getElementById('hint3');
  var hint4 = document.getElementById('hint4');
  var hint5 = document.getElementById('hint5');
  var hint6 = document.getElementById('hint6');
  var hint7 = document.getElementById('hint7');
  var hint8 = document.getElementById('hint8');
  var deleteButton = document.getElementById('deleteButton');
  var findButton = document.getElementById('findButton');
  var submitButton = document.getElementById('submitButton');
  var hintList = {};
  const rootRef = firebase.database().ref();

  submitButton.addEventListener("click",function(e){
    e.preventDefault();
    hintList = pushHints(hint1.value,hint2.value,hint3.value,
              hint4.value,hint5.value,hint6.value,hint7.value,hint8.value);
    createNewTerm(rootRef);
  });

  //create new term that will be submitted
  function createNewTerm(rootRef){
    var key = null;
    var categoryRef = rootRef.child('categories').orderByKey();

    categoryRef.once('value').then(function(categoryKeys){//check if subject exist
      categoryKeys.forEach(function(snapSubjects){
        var k = snapSubjects.val();
        if(k.subject===category.value){
          key = snapSubjects.key
          return pushTerm(key,answer.value,rootRef,hintList);
        }
      });
    }).then(function(data){
        if(key===null){//if no match was found then pushTerm and create new category
          key = createNewCategory(rootRef);
          return pushTerm(key,answer.value,rootRef,hintList);
        }
      },function(error){
          //something went wrong
          console.error(error);
        });
  }

  function pushTerm(key,answer,rootRef,hintList){
    //A Term entry
    var termData = {
      term:answer,
      hint:hintList
    };

    //Write the new term's data to the database
    var updates = {};
    updates['/terms/' + answer] = termData;
    updates['/category-terms/'+ key + '/' + answer]  = termData;
    return firebase.database().ref().update(updates);

  }

  function createNewCategory(rootRef){
    //Get a new key for a category
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
    return newCategoryKey;
  }

  //push hints that our not null to an array
  function pushHints(h1, h2, h3, h4, h5, h6, h7, h8){
    var list = {
        hint1:h1,
        hint2:h2,
        hint3:h3,
        hint4:h4,
        hint5:h5,
        hint6:h6,
        hint7:h7,
        hint8:h8
      };
    return list;
  }


});
