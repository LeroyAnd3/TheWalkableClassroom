//retrieve a set a terms for a category
let handles = [];
const rootRef = firebase.database().ref();
const categoryRef = rootRef.child('categories');
const categoryTermsRef = rootRef.child('category-terms')

function getCategoryTerms(category,cb){
    let query = categoryRef.orderByChild('subject').equalTo(category);
    query.on('child_added',snap => {
      let query2 = categoryTermsRef.child('snap.key');
        query2.on('value',snap => {
            snap.forEach(term => {
              console.log(term.val());
      });
    });
  });
}

getCategoryTerms("Span 101",snap => console.log(snap.val()));



// let query = categoryRef.orderByKey(); //get the keys from category
// query.once('value').then(snap => {
//   snap.forEach(function(snapshots){
//     if(snapshots.val().subject===category){
//       let query2 = categoryTermsRef.child(snapshots.key).on('child_added');
//       query2.on('value',cb);
//     }
//   });
// });
