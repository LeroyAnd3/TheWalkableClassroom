//retrieve a set a terms for a category

const rootRef = firebase.database().ref();
const categoryRef = rootRef.child('categories');
const categoryTermsRef = rootRef.child('category-terms');
let cardnumber = 0;// the card id in the collection of cards

/*
category is the subject category that you want to access
cardColllection is an array that will hold each new card
*/

function getCategoryTerms(category,cardColllection){
    cardnumber=0; //reset cardnumber for the next set of terms
    let query = categoryRef.orderByChild('subject').equalTo(category);
    query.once('child_added',snap => {//get key from category
      let query2 = categoryTermsRef.child(snap.key);//get terms from category
        query2.once('value',snap => {
            snap.forEach(term => {
              let card = []
              let k = term.val();
              makeCard(card,cardColllection,k.id,k.hint,k.term);
      });
    });
  });
}

//fill an array with they current subjects available
//categories is array to hold the results
function getCategories(categories){
  categoryRef.on('value',snap=>{
    snap.forEach(subject=>{
      categories.push(subject.val().subject);
    });
  });
}

// snap.forEach(subject=>{
//   console.log(subject.val().subject);
//   let value = "" + subject.val().subject;
//   if(value instanceof String){
//     let option = document.createElement('option');
//     option.text = value;
//     category.add(option);
//   }
//   else{
//     alert(typeof text);
//   }
// });
//
// var subjects = snap.val();
// var keys = Object.keys(subjects);
// console.log(keys);
// for(var i=0; i<keys.length;i++){
//   var k = keys[i];
//   var value = subjects[k].subject;
//   var option = document.createElement('option');
//   cate
// }
//creates a list of topics for the user to pick from to play
function appendCategories(){
  categoryRef.on('value',snap=>{
    snap.forEach(subject=>{
      // console.log(subject.val().subject);
      let value = String(subject.val().subject);
      let category = document.getElementById('categories');
      console.log(value, typeof value);

        //alert("inside of if statement");
        let option = document.createElement('option');
        option.text = value;
        category.add(option);

    });
  });
}

function makeCard(card,cardArray,id,list,term){
  card.push(cardnumber);
  cardnumber++;
  card.push(term);
  if(getHint1(list)){
    card.push(getHint1(list));
  }
  if(getHint2(list)){
    card.push(getHint2(list));
  }
  if(getHint3(list)){
    card.push(getHint3(list));
  }
  if(getHint4(list)){
    card.push(getHint4(list));
  }
  if(getHint5(list)){
    card.push(getHint5(list));
  }
  if(getHint6(list)){
    card.push(getHint6(list));
  }
  if(getHint7(list)){
    card.push(getHint7(list));
  }
  if(getHint8(list)){
    card.push(getHint8(list));
  }
  cardArray.push(card);

}

function getHint1(list){
  return list.hint1;
}

function getHint2(list){
  return list.hint2;
}

function getHint3(list){
  return list.hint3;
}

function getHint4(list){
  return list.hint4;
}

function getHint5(list){
  return list.hint5;
}

function getHint6(list){
  return list.hint6;
}

function getHint7(list){
  return list.hint7;
}

function getHint8(list){
  return list.hint8;
}
