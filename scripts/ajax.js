"use strict";

// GLOBALS
var MUSIXMATCH_URL = "http://api.musixmatch.com/ws/1.1/";
var MUSIXMATCH_API_KEY = "36205906f20a5ef92a7ab93a1ec2f9b5";
var YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/";
var YOUTUBE_API_KEY = "AIzaSyDGeZnNQRKQC5-C6ULLlJf6dtKRUZE9A8o";

// READY FUNCTION
$(document).ready(function() {
	$('#searchButton').on('click', function(event) {
		var search = $('#search').val();
		getResults(encodeURIComponent(search));
	}); //  end search button listener

	$('#search').keypress(function(e) {
		if (e.keyCode == 13) {
			var search = $('#search').val();
			getResults(encodeURIComponent(search));
		}
	});

	$('.doc').on('click', function(e) {
		var leftPanel = document.querySelector('#leftPanel');
		leftPanel.className = "panel-close";
		console.log('clicked');
	});
}); // end ready

// AJAX
function getResults(search) {
	var url = MUSIXMATCH_URL;
	var e = document.querySelector('#searchType');
	var searchType = e.options[e.selectedIndex].value;
	url += "track.search?";
	url += searchType + search;
	url += "&format=jsonp";
	url += "&apikey=" + MUSIXMATCH_API_KEY;
	console.log(url);

	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: onJSONLoaded
	});
} // end getResults()

function lyricsAJAX(url) {
	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: function(lyricsObj) {
			var lyrics = lyricsObj.message.body.lyrics.lyrics_body;
			var copyright = lyricsObj.message.body.lyrics.lyrics_copyright;
			var main = document.querySelector('#main');
			main.innerHTML = lyrics + copyright;
			//console.log(lyrics);

			var scriptURL = lyricsObj.message.body.lyrics.script_tracking_url;
			var script = document.querySelectorAll('script')[2];
			script.setAttribute('src', scriptURL);
		}
	});
} // end lyricsAJAX()

function youtubeAJAX(url) {
	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: function(youtubeObj) {
			var videoId = youtubeObj.items[0].id.videoId;
			var video = document.querySelector('#video');
			video.setAttribute('src', "http://youtube.com/embed/" + videoId);
		}
	});
} // end youtubeAJAX()


// FUNCTIONS
function onJSONLoaded(obj) {
	//console.log(JSON.stringify(obj));

	var statusCode = obj.message.header.status_code;
	switch (statusCode) {
		case 200:
			returnResults(obj);
			break;
		case 400:
			console.log("Error 400 - The request had bad syntax or was inherently impossible to be satisfied.");
			break;
		case 401:
			console.log("Error 401 - Authentication failed, probably because of invalid/missing API key.");
			break;
		case 402:
			console.log("Error 402 - The usage limit has been reached, either you exceeded per day requests limits or your balance is insufficient.");
			break;
		case 403:
			console.log("Error 403 - You are not authorized to perform this operation.");
			break;
		case 404:
			console.log("Error 404 - The requested resource was not found.");
			break;
		case 405:
			console.log("Error 405 - The requested method was not found.");
			break;
		case 500:
			console.log("Error 500 - Ops. Something was wrong.");
			break;
		case 503:
			console.log("Error 503 - Our system is a bit busy at the moment and your request can’t be satisfied.");
			break;
		default:
			console.log("ERRORS!! :(");
	}
} // end onJSONLoaded

function returnResults(obj) {
	var results = obj.message.body.track_list;
	var resultsdiv = document.querySelector('#results');

	if (results.length == 0)
		resultsdiv.innerHTML = "no results found";
	else {
		resultsdiv.innerHTML = "";
		for (var i=0; i<results.length; i++) {
			var track_id = results[i].track.track_id;
			var track_name = results[i].track.track_name;
			var album_name = results[i].track.album_name;
			var artist_name = results[i].track.artist_name;
			var coverart = results[i].track.album_coverart_100x100;

			var result = document.createElement('div');
			var cover = document.createElement('img');
			var info = document.createElement('div');
			var title = document.createElement('strong');
			var album = document.createElement('p');
			var artist = document.createElement('p');
			var em = document.createElement('em');

			title.innerHTML = track_name;
			em.innerHTML = album_name;
			artist.innerHTML = artist_name;
			cover.setAttribute('src', coverart);
			result.setAttribute('value', track_id);
			result.setAttribute('name', artist_name + " " + track_name);
					
			resultsdiv.appendChild(result);
			result.appendChild(cover);
			result.appendChild(info);
			info.appendChild(title);
			album.appendChild(em);
			info.appendChild(album);
			info.appendChild(artist);

			result.className = "result";
			cover.className = "resultAlbum";
			info.className = "resultInfo";

			result.addEventListener('click', function(e) {
				var track_id = this.getAttribute('value');
				var lyricsURL = MUSIXMATCH_URL;
				lyricsURL += "track.lyrics.get?";
				lyricsURL += "&track_id=" + track_id;
				lyricsURL += "&format=jsonp";
				lyricsURL += "&apikey=" + MUSIXMATCH_API_KEY;
				//console.log(lyricsURL);
				lyricsAJAX(lyricsURL);

				var youtubeURL = YOUTUBE_URL;
				youtubeURL += "search?part=snippet";
				youtubeURL += "&q=" + encodeURIComponent(this.getAttribute('name'));
				youtubeURL += "&type=video";
				youtubeURL += "&key=" + YOUTUBE_API_KEY;
				console.log(youtubeURL);
				youtubeAJAX(youtubeURL);

				for (var i=0; i<results.length; i++) {
					if (results[i].track.track_id == track_id) {
						var infoTitle = document.querySelector('#infoTitle');
						var infoAlbum = document.querySelector('#infoAlbum');
						var infoArtist = document.querySelector('#infoArtist');
						var coverart = document.querySelector('#albumArt');
						var player = document.querySelector('#player');

						var spotify_id = results[i].track.track_spotify_id;

						infoTitle.innerHTML = results[i].track.track_name;
						infoAlbum.innerHTML = results[i].track.album_name;
						infoArtist.innerHTML = results[i].track.artist_name;
						if (results[i].track.album_coverart_350x350 == "") {
							coverart.setAttribute('src', results[i].track.album_coverart_100x100);
						} else {
							coverart.setAttribute('src', results[i].track.album_coverart_350x350);
						}
					} // end if
				} // end for
				player.setAttribute('src', "https://embed.spotify.com/?uri=spotify:track:" + spotify_id);
			}); // end result listener
		} // end for
	} // end else
}