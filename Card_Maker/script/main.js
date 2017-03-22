
'use strict'
$(document).ready(function(){
  //Shortcuts to DOM Elements
  alert("in main js");
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

  var hintArray = [];
  pushHints(hintArray,hint1.val(),hint2.val(),hint3.val(),
            hint4.val(),hint5.val(),hint6.val(),hint7.val(),hint8.val());

  submitButton.on('click',function(e){
    alert("submit button worked");
    e.preventDefault();
    alert("submit button worked");
    var key = writeNewCategory(category.val());
    writeNewTerm(key,answer.val(),hintArray);
  });
});


//push hints that our not null to an array
void function pushHints(array[], hint1, hint2, hint3,
                  hint4, hint5, hint6, hint7, hint8){
      alert("entered push hint function");
      if(!isEmptyObject(hint1))
        array.push(hint1);
      if(!isEmptyObject(hint2))
        array.push(hint2);
      if(!isEmptyObject(hint3))
        array.push(hint3);
      if(!isEmptyObject(hint4))
        array.push(hint4);
      if(!isEmptyObject(hint5))
        array.push(hint5);
      if(!isEmptyObject(hint6))
        array.push(hint6);
      if(!isEmptyObject(hint7))
        array.push(hint7)
      if(!isEmptyObject(hint8))
        array.push(hint8);
    alert("end of push hint function. Size: " + array.length);

}

function writeNewCategory(category){
  alert("entered new category");
  //A category entry
  var categoryData = {
    subject: category
  };
  //Get a new key for a category
  var newCategoryKey = firebase.database().ref().child('categories').push().key;

  //Write new category data
  var updates = {};
  updates['/categories/' + newCategoryKey] = categoryData;
  firebase.database().ref().update(updates);
  alert("end of new category");
  return newCategoryKey;
}

function writeNewTerm(categoryKey,answer,array[]){
  //A Term entry
  var termData = {
    term:answer,
    hintCount:0,
  };
  var newTermKey = firebase.database().ref().child("terms").key;
  //Write the new term's data to the database
  var updates = {};
  updates['/terms/' + newTermKey] = termData;
  updates['/category-terms/'+ categoryKey + '/' + newTermKey]  = termData;
  var postRef = firebase.database().ref().update(updates);
  var tmp = "clue";
  for(var i=0;i<array.length;i++){
    var tmp2 = tmp+i;
    addHint(postRef,array[i],tmp2);
  }
}

function addHint(postRef,hint,clue){
  postRef.transaction(function(terms){
    if(!terms.hints)
      terms.hints = {};
    terms.hints[clue] = hint;
  });
}
