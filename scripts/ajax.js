"use strict";

// GLOBALS
var MUSIXMATCH_URL = "http://api.musixmatch.com/ws/1.1/";
var MUSIXMATCH_API_KEY = "36205906f20a5ef92a7ab93a1ec2f9b5";

// READY FUNCTION
$(document).ready(function() {
	$('#searchButton').on('click', function(event) {
		var search = $('#search').val();
		getResults(encodeURIComponent(search));
	}); //  end search button listener

	$('#testLeft').on('click', function(event) {
		$('#body').toggleClass('leftPanel-open');
		return false;
	});

	$('#testRight').on('click', function(event) {
		$('#body').toggleClass('rightPanel-open');
		return false;
	});
}); // end ready

// FUNCITONS
function getResults(search) {
	var url = MUSIXMATCH_URL;
	var e = document.querySelector('#searchType');
	var searchType = e.options[e.selectedIndex].value;
	url += "track.search?";
	url += searchType + search;
	url += "&apikey=" + MUSIXMATCH_API_KEY;
	url += "&format=jsonp";
	console.log(url);

	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: onJSONLoaded
	});
} // end getResults()

function onJSONLoaded(obj) {
	//console.log(JSON.stringify(obj));
	var results = obj.message.body.track_list;
	for (var i=0; i<results.length; i++) {
		
	}
}