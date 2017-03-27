//retrieve a set a terms for a category

const rootRef = firebase.database().ref();
const categoryRef = rootRef.child('categories');
const categoryTermsRef = rootRef.child('category-terms')

/*
category is the subject category that you want to access
cardColllection is an array that will hold each new card
*/

function getCategoryTerms(category,cardColllection){
    let query = categoryRef.orderByChild('subject').equalTo(category);
    query.once('child_added',snap => {//get key from category
      let query2 = categoryTermsRef.child(snap.key);//get terms from category
        query2.once('value',snap => {
            snap.forEach(term => {
              console.log(term.val());
              let card = []
              let k = term.val();
              makeCard(card,categoryTermArray,k.id,k.hint,k.term);
      });
    });
  });
}

function makeCard(card,cardArray,id,list,term){
  card.push(id);
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
