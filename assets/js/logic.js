// HTML Handler //
pageHome();
function hideHTML() {
    $("#nav").hide();
    $("#homePage").hide();
    $("#resultPage").hide();
    $("#artistPage").hide();
    $("#mapPage").hide();
}
function navSearch() {
    $("#nav").show();
    $("#searchBoxNav").show();
    $("#searchBoxMap").hide();
}
function navMap() {
    $("#nav").show();
    $("#searchBoxNav").hide();
    $("#searchBoxMap").show();
}
function pageHome() {
    hideHTML();
    $("#homePage").show();
}
function pageResult() {
    hideHTML();
    navSearch();
    $("#resultPage").show();
}
function pageArtist() {
    hideHTML();
    navSearch();
    $("#artistPage").show();
}
function pageMap() {
    hideHTML();
    navMap();
    $("#mapPage").show();
}

$(document).on("click", "#navBtn", pageHome);
$(document).on("click", "#searchBtn", pageResult);
$(document).on("click", "#searchBtnNav", pageResult);
$(document).on("click", "#searchBtnMap", pageMap);
$(document).on("click", ".resultBtn", pageArtist);
$(document).on("click", "#artistVenueBtn", pageMap);
$(document).on("click", "#mapBtn", pageMap);
$(document).on("click", "#loginBtn", spotifyLogin);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Spotify //

// var clientSecret = '8238cc51bc5b44d08a898fee93208f2a'; // Unknown what this actually does

// Global Variables
var queryURL = 'https://api.spotify.com/v1/';

var userInput = ''; // User input from search bar
var getID = ''; // Generated ID for search result
var getName = ''; // Generated name for search result

var artistName = ''; // Artist name generated after result click
var artistImage = ''; // Artist image generated after result click
var artistWebLink = ''; // Artist web link generated after result click
var artistAppLink = ''; // Artist app link generated after result click

// Global track variables go here...

var albumName = ''; // Most recent album name
var albumImage = ''; // Most recent album image
var albumWebLink = ''; // Most recent album web link
var albumAppLink = ''; // Most recent album app link

function spotifyLogin() {
    var clientId = 'ade24c3ebf1f4fe9929161afd7003c01'; // from https://developer.spotify.com/dashboard/applications
    var callbackURL = window.location.href; // the current web page
    spotify.login(clientId, callbackURL);
}
function spotifyLogout() {
    spotify.logout();
}



function getResultClick() {
    getID = data.artist.items[$(this.attr("value"))].id;
    getName = data.artist.items[$(this.attr("data-name"))].name;
}



function searchStart(event) {
    event.preventDefault();
    userInput = $("#searchText").val().trim();
    location.href = "results.html";
}
function getSearch(event) {
    console.log(userInput);
    $('#results').empty();
    spotify.call(
        `${queryURL}search`,
        { q: userInput, type: 'artist', market: 'US', limit: '20', offset: '0' },
        callSearch
    );
}
function getArtist() {
    $('#artist').empty();
    spotify.call(
        `${queryURL}artists/${artistID}`, // JSON for specified artist
        { market: 'US' },
        callArtist
    );
}
function getTracks() {
    $('#tracks').empty();
    spotify.call(
        `${queryURL}artists/${artistID}/top-tracks`, // JSON for specified artist's "Top-Tracks"
        { market: 'US' },
        callTracks
    );
}
function getAlbum() {
    $('#album').empty();
    spotify.call(
        `${queryURL}artists/${artistID}/albums`, // JSON for specified artist's "Albums"
        { market: 'US' },
        callAlbum
    );
}



function callSearch(data) {
    console.log(data); // Full Data List
    // Loop to create search results & links
    for(var i = 0; i < 20; i++) {
        if (data.artist.items[i] !== undefined) {
            var newSearchLink = $(`<a href="artists.html" value="${i}">`);
            var newSearchDiv = $(`<div class="resultBox">`);
            var newSearchImage = $(`<img src="${data.artist.items[i].images[0].url}" class="resultImage">`);
            var newSearchName = $(`<p class="resultName">`);
            newSearchName.text(data.artist.items[i].name);
            newSearchDiv.append(newSearchImage);
            newSearchDiv.append(newSearchName);
            newSearchLink.append(newSearchDiv);
            $("#results").append(newSearchLink);
        }
    }
}
function callArtist(artistData) {
    console.log(artistData); // Full artistData List

    artistName = artistData.name;
    artistImage = artistData.images[0].url;
    artistWebLink = artistData.external_urls.spotify;
    artistAppLink = artistData.uri;
}
function callTracks(trackData) {
    console.log(trackData); // Full trackData List

    // Track variables and widgets go here...
}
function callAlbum(albumData) {
    console.log(albumData); // Full albumData List

    // Most recent album and widget goes here...

    albumName = albumData.name;
    albumImage = albumData.images[0].url;
    albumWebLink = albumData.external_urls.spotify;
    albumAppLink = albumData.uri;
}

$(document).on("click", "#loginButton", spotifyLogin);
$(document).on("click", "#logoutButton", spotifyLogout);
$(document).on("click", "#searchButton", searchStart);
$(document).on("click", "#searchButton2", searchStart);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Google Maps //

var map;
var service;
var infowindow;
var markers = [];


// Function to load map and ask for Geolocation.  Will run after DOM is loaded.
function initialize() {
    // Starting map location is set to New York, NY.  This can be changed.
    var startingMap = new google.maps.LatLng(40.713, -74.006);
    //  Grabing Map div on DOM and filling with a default map location.
    map = new google.maps.Map(document.getElementById('mapBox'), {
        center: startingMap,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        //  Variable to store place entered by user in search bar.
        var places = searchBox.getPlaces();
        //  Variable to store Lat Lang of place entered by user.
        var newPos = places[0].geometry.location;
        //  Clearing markers
        setMapOnAll(null);
        markers = [];
        //  Changing position of map to location entered by user.
        map.setCenter(places[0].geometry.location);

        //  Object to store Google Places API Text Search parameters.
        var request = {
            location: newPos,
            radius: '500',
            query: 'music venue'
        };

        // Calling Google Places API Text Search Service
        service = new google.maps.places.PlacesService(map);
        //  Calling function to add markers based on Text Search results.
        service.textSearch(request, callback);

    });

    //  Using Geolocation API to have browser ask for user's location.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                //  Variable to store user's latitude and longitude coordinates.
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //  Positioning map to user's geolocation.
                map.setCenter(pos);

                //  Object to store Google Places API Text Search parameters.
                var request = {
                    location: pos,
                    radius: '500',
                    query: 'music venue'
                };

                // Calling Google Places API Text Search Service.
                service = new google.maps.places.PlacesService(map);
                //  Calling function to add markers based on Text Search results.
                service.textSearch(request, callback);

            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            }

        );
    } else {
        // Browser doesn't support Geolocation or user selects no.
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

//  Function using for loop that is needed to clear markers when user searches a new city.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//  Function using a for loop to create markers based on results of desired search method.  Returns 20 results.
function callback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

//  Function to create a marker for each place found in the search method.
function createMarker(place) {
    var placeLoc = place.geometry.location;
    //  Variable to hold JSON data of each marker.
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    //  Pusing each marker to marker array.  Used to clear old markers.
    markers.push(marker);

    //  Function to show InfoWindow when user clicks a marker.
    google.maps.event.addListener(marker, 'click', function() {
        //  Setting content of InfoWindow
        infowindow.setContent('<div><b>' + place.name + '</b><br>' +
            place.formatted_address + '<br><a href="https://www.google.com/maps/search/?api=1&query=' + place.name + '" target="_blank">View on Google Maps</a>' + '</div>');
        //  Displaying the InfoWindow of marker clicked by user.
        infowindow.open(map, this);
    });
}