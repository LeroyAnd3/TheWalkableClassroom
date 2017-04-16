var testObject = {
  make: "take",
  rake: "bake"
};

localStorage.setItem(
  'test',
  JSON.stringify(testObject)
);

testObject = {
  make: "take",
  rake: "steak"
};

localStorage.setItem(
  'test1',
  JSON.stringify(testObject)
);


$(document).ready(function(){
  $('.accordion').click(function (e) {
    var className = ''
    if(e)
      className = e.target.className;
    e.preventDefault();

    if(className !== 'typeSelect') { //Prevents dropdown on events where select was clicked
      var panel = this.nextElementSibling;
      if (panel.style.display === "inline-block") {
                  panel.style.display = "none";
      } else {
                  panel.style.display = "inline-block";
              }
    }

  });
});
