var posts = {};
var postObjects = {};
// var postHTMLoB = {};
var byebye = null;

function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var byebyenegativity = function() {
	var userID = document.querySelectorAll('._2s25')[0].getAttribute('href').split('/').pop();
    var domPosts = document.querySelectorAll('.userContentWrapper'); //accessible_elem
	var newPosts = {};
	console.log(userID);
    for (var i = 0; i < domPosts.length; i++) {
		// debugger;
		try {
			var uuid = domPosts[i].querySelectorAll('.timestampContent')[0].parentElement.parentElement.getAttribute('href').split(/permalink\/|posts\/|videos\/|photos\//gi)[1];
			if(uuid == undefined) {
				uuid = gup('fbid', domPosts[i].querySelectorAll('.timestampContent')[0].parentElement.parentElement.getAttribute('href'));
			}
			if(posts[uuid] != undefined) {
				continue;
			}
			var postText = domPosts[i].querySelectorAll('.userContent')[0].innerHTML;
			if(postText == "") {
				continue;
			}
			postText = postText.replace(/<[^>]*>/gi, '');
			// debugger;
			var poster_id = domPosts[i].querySelectorAll('.clearfix a')[1].getAttribute('href').split('/').pop();
			if(poster_id.charAt(0) == '?') {
				poster_id = domPosts[i].querySelectorAll('.clearfix a')[1].getAttribute('href').split('/');
				poster_id = poster_id[poster_id.length - 2];
			}
			posts[uuid] = {
				profile_id: poster_id,
				postText: postText
			}
			newPosts[uuid] = {
				profile_id: poster_id,
				postText: postText
			}
			postObjects[uuid] = domPosts[i];
		} catch(err) {
			// console.log("Sponsored post found")
		}
    }
	console.log(newPosts);
	if(Object.keys(newPosts).length < 1) {
		return;
	}
	// byebye = null;
	$.ajax({
		url: 'https://138.197.8.18:5000/',
		method: 'POST',
		data: {
			data : JSON.stringify({
				user_profile: userID,
				posts: newPosts
			})
		},
		success: function(r) {
			console.log(r);
			r = JSON.parse(r);
			r = r.posts;
			// debugger;
			Object.keys(r).forEach(function(key) {
				var postID = key.substring(0, key.lastIndexOf('/'))
				console.log(key);
				console.log(posts);
				if(r[key].score == -1) {
					var post = postObjects[postID];
					var poster = posts[postID].profile_id;
					var overlay = document.createElement('div');
					overlay.setAttribute('class', 'noshit-blocked');
					var overlayText = document.createElement('span');
					overlayText.innerHTML = "This person is adding a lot of negativity in your life.";
					var overlayLink = document.createElement('a');
					overlayLink.innerHTML =  "Click here to go to his profile and unfriend.";
					overlayLink.setAttribute('href', "https://www.facebook.com/" + poster);
					overlay.appendChild(overlayText);
					overlay.appendChild(overlayLink);
					post.appendChild(overlay);
				}
				else if(r[key].score < 0.5) {
					// debugger;
					var post = postObjects[postID];
					var overlay = document.createElement('div');
					overlay.setAttribute('class', 'noshit-blocked');
					var query = r[key].topics[0]
					$.ajax({
						'method': "GET",
						'url': "https://api.cognitive.microsoft.com/bing/v5.0/images/search",
						data: {
							q: (query ? "cute " + query : "cute")
						},
						headers: {
						},
						success: function(r) {
							// var overlayImage = document.createElement('img');
							// overlayImage.setAttribute('src', r.value[getRandomInt(0, 10)].contentUrl);
							post.appendChild(overlay);
							try {
								var bg = "url(" + r.value[getRandomInt(0, Math.min(r.totalEstimatedMatches, 10))].contentUrl + ")";
							} catch(err) {
								var bg = "url(" + r.value[getRandomInt(0, Math.min(r.totalEstimatedMatches, 0))].contentUrl + ")";
							}
							console.log(bg);
							$(overlay).css('background-image', bg);
							$(overlay).css('background-size', "cover");
							$(overlay).css('background-position', "center");
						},
						error: function() {
							var overlayText = document.createElement('span');
							overlayText.innerHTML = "This post is hidden for being too negative";
							overlay.appendChild(overlayText);
							post.appendChild(overlay);
						}
					});
				}
			});
			byebye = null;
		},
		error: function(r) {
			console.log(r);
			byebye = null;
		}

	})
    return true;
}
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log(byebyenegativity())
    }, 1000);
}, false);
// $(document).on("scroll", function() {
//     if ($(document).scrollTop() > 0)
// 		if(byebye == null) {
// 			byebye = setTimeout(byebyenegativity(), 2000);
// 		}
//     }
// );

var clearTimeout = null;

document.addEventListener("scroll", function(e) {
	// e.preventDefault();
	// console.log("event fired");
	// console.log(byebye);
	if(byebye == null) {
		byebye = setTimeout(byebyenegativity(), 2000);
	}
	clearTimeout = setTimeout(function() {
		byebye = null;
		clearTimeout = null;
	}, 2000);
});
