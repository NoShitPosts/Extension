var byebyeemotions = function() {
  var likeHover = document.querySelectorAll('._1oxj'); //accessible_elem
  for(var i=0 ; i<likeHover.length ; i++) {
    likeHover[i].remove()
  }
  return true;
}
window.addEventListener ('load', function () {
  setTimeout(function () {
    console.log(byebyeemotions())
  }, 1000);

  setTimeout(function () {
    console.log(byebyeemotions())
  }, 7000);


  setTimeout(function () {
    console.log(byebyeemotions())
  }, 15000);


}, false);




$(document).on("scroll", function(){
	console.log("Eventr fired");
				if ($(document).scrollTop()> 2000) byebyeemotions();


		});
