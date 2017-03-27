//retrieve a set a terms for a category
let handles = [];
let rootRef = firebase.database().ref();
let cateRef = rootRef.child('category');
let cateTermsRef = rootRef.child('category-terms')

function getCategoryTerms(category,cb){
  cateRef.equalTo(category).once('child_added',snap => {
    cateTerm = cateTermsRef.child(snap.key);
    cateTerm.once('value',cb);
  });
}

getCategoryTerms("Fruits", snap => console.log(snap.val()));
