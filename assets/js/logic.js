// var clientSecret = '8238cc51bc5b44d08a898fee93208f2a'; // Unknown what this actually does

////////////////////Firebase Database //////////////////////////

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChzlaQuNcxmyvTFg7EFshMpcjWPKzsut4",
    authDomain: "monki-4fbfd.firebaseapp.com",
    databaseURL: "https://monki-4fbfd.firebaseio.com",
    projectId: "monki-4fbfd",
    storageBucket: "",
    messagingSenderId: "517492750425",
    appId: "1:517492750425:web:bda4964130a6da3c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Variable for database
var database = firebase.database();

// Function and variable to store artist in database
function storeArtistSearch(){
    var recentArtistSearch = {
        recentArtist: userInput
    };
    database.ref().push(recentArtistSearch);
};

// Global Variables
var spotifyQueryURL = 'https://api.spotify.com/v1/';

var userInput = ''; // User input from search bar
var spotifyID = ''; // Generated ID for search result
var artistName = ''; // Generated name for search result

// Home page call on ready
homePage();

// Login to Spotify
function spotifyLogin() {
    var clientId = 'ade24c3ebf1f4fe9929161afd7003c01'; // from https://developer.spotify.com/dashboard/applications
    var callbackURL = window.location.href; // the current web page
    spotify.login(clientId, callbackURL);
}
// Logout of Spotify
function spotifyLogout() {
    spotify.logout();
}

// Hide HTML
function hideHTML() {
    $("#nav").hide();
    $("#homePage").hide();
    $("#resultPage").hide();
    $("#artistPage").hide();
    $("#mapPage").hide();
}
// Show HTML
function showHome() {
    hideHTML();
    $("#homePage").show();
}

function showResult() {
    hideHTML();
    $("#nav").show();
    $("#searchBoxNav").show();
    $("#searchBoxMap").hide();
    $("#resultPage").show();
}

function showArtist() {
    hideHTML();
    $("#nav").show();
    $("#searchBoxNav").show();
    $("#searchBoxMap").hide();
    $("#artistPage").show();
}

function showMap() {
    hideHTML();
    $("#nav").show();
    $("#searchBoxNav").hide();
    $("#searchBoxMap").show();
    $("#mapPage").show();
}

/////////////////////// HOME PAGE ///////////////////////
function homePage() {
    $("#searchTxt").val("");
    $("#searchTxtNav").val("");
    showHome();
}

/////////////////////// RESULT PAGE ///////////////////////
// Get user input
function homeSearch() {
    userInput = $("#searchTxt").val().trim();
    storeArtistSearch();
    $("#searchTxt").val("");
    resultPage();
}
// Get user input
function navSearch() {
    userInput = $("#searchTxtNav").val().trim();
    storeArtistSearch();
    $("#searchTxtNav").val("");
    resultPage();
}

function resultPage() {
    console.log(userInput);
    if (userInput !== "" && userInput !== undefined) {
        // Call Spotify result
        spotify.call(
            `${spotifyQueryURL}search`, { q: userInput, type: 'artist', market: 'US', limit: '20', offset: '0' },
            spotifyResult
        );
    } else {
        console.log("ERROR: Do not leave the search input blank!");
    }
}

function spotifyResult(data) {
    console.log(data); // Full Data List

    // Empty old results
    $('#results').empty();

    // Write to HTML
    $("#resultTitle").text(`Artist results for "${userInput}"`);

    // Loop to create search results & links
    for (var i = 0; i < 20; i++) {
        if (data.artists.items[i] !== undefined && data.artists.items[i].images.length !== 0) {
            var newSearchLink = $(`<a class="resultBtn" href="#">`);
            var newSearchDiv = $(`<div class="resultBox" data-name="${data.artists.items[i].name}" data-id="${data.artists.items[i].id}">`);
            var newSearchImage = $(`<img src="${data.artists.items[i].images[0].url}" class="resultImage">`);
            var newSearchName = $(`<p class="resultName">`);
            newSearchName.text(data.artists.items[i].name);
            newSearchDiv.append(newSearchImage);
            newSearchDiv.append(newSearchName);
            newSearchLink.append(newSearchDiv);
            $("#results").append(newSearchLink);
        } else if (data.artists.items[0] == undefined) {
            $("#resultTitle").text(`No artist results for "${userInput}"`);
            continue;
        } else {
            console.log("Artist does not exist or is missing parameters, skipping...");
        }
    }

    // Show HTML
    showResult();

    $(".resultBox").on("click", artistPage);

}

/////////////////////// ARTIST PAGE ///////////////////////
function artistPage() {
    // Get Spotify artist ID & artist name
    spotifyID = $(this).attr("data-id");
    console.log(spotifyID);
    artistName = $(this).attr("data-name");
    console.log(artistName);
    getArtistID();

    // Call Spotify artist & top-tracks
    spotify.call(
        `${spotifyQueryURL}artists/${spotifyID}`, // JSON for specified artist
        { market: 'US' },
        spotifyArtist
    );
    spotify.call(
        `${spotifyQueryURL}artists/${spotifyID}/top-tracks`, // JSON for specified artist's "Top-Tracks"
        { market: 'US' },
        spotifyTrack
    );

}

function spotifyArtist(artistData) {
    console.log(artistData); // Full artistData List

    // Write to HTML
    $("#artistTitle").text(`Artist page for "${artistData.name}"`);
    $("#artistImage").attr("src", artistData.images[0].url);
    $("#artistName").text(artistData.name);
    $("#linkWeb").attr("href", artistData.external_urls.spotify);
    $("#linkApp").attr("href", artistData.uri)
}

function spotifyTrack(trackData) {
    console.log(trackData); // Full trackData List

    // Empty old tracks
    $('#tracks').empty();

    // For loop to create track links
    for (var i = 0; i < 10; i++) {
        if (trackData.tracks[i] !== undefined) {
            var newTrackDiv = $(`<div class="trackFix">`);
            var newTrackLink = $(`<a class="artistTrackBtn" href="${trackData.tracks[i].uri}">`);
            var newTrackImage = $(`<img class="artistTrackImage" src="${trackData.tracks[i].album.images[0].url}">`);
            var newTrackName = $(`<p class="artistTrackName">`);
            newTrackName.text(trackData.tracks[i].name);
            newTrackLink.append(newTrackImage);
            newTrackLink.append(newTrackName);
            newTrackDiv.append(newTrackLink);
            $("#tracks").append(newTrackDiv);
        }
    }

    // Show HTML
    showArtist();
}

/////////////////////// MAP PAGE ///////////////////////
function mapPage() {
    showMap();
    initialize();
}

$(document).on("click", "#navBtn", showHome);
$(document).on("click", "#searchBtn", homeSearch);
$(document).on("click", "#searchBtnNav", navSearch);
$(document).on("click", "#searchBtnMap", mapPage);
$(document).on("click", "#mapBtn", mapPage);
$(document).on("click", "#loginBtn", spotifyLogin);
$(document).on("click", ".artistVenueBtn", showVenue);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Song Kick //

var songkickArtistID, venue, venueLat, venueLng, city, date, venueLocation;

function getArtistID() {

    // Querying the songkick api for the selected artist
    let songkickArtistURL = "https://api.songkick.com/api/3.0/search/artists.json?apikey=fsP4jkGr6vQE1jDS&query=" + artistName;

    $.ajax({
        url: songkickArtistURL,
        method: "GET"
    }).then(function(response) {

        songkickArtistID = response.resultsPage.results.artist[0].id;
        searchUpcoming();
        console.log(songkickArtistID);
    });
}


function searchUpcoming() {

    $('#venues').empty();

    // Searching upcoming events based on Songkick artist ID
    let songkickUpcomingURL = "https://api.songkick.com/api/3.0/artists/" + songkickArtistID + "/calendar.json?apikey=fsP4jkGr6vQE1jDS";

    $.ajax({
        url: songkickUpcomingURL,
        method: "GET"
    }).then(function(response) {

        console.log(response);


        for (i = 0; i < response.resultsPage.results.event.length; i++) {

            venue = response.resultsPage.results.event[i].venue.displayName;
            venueLat = response.resultsPage.results.event[i].location.lat;
            venueLng = response.resultsPage.results.event[i].location.lng;
            city = response.resultsPage.results.event[i].location.city;
            date = response.resultsPage.results.event[i].start.date;
            venueLocation = {
                lat: venueLat,
                lng: venueLng
            };

            let newDate = new Date(date);
            let showDate = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear();

            console.log("Venue: " + venue);
            console.log("City: " + city);
            console.log("Date: " + showDate);
            console.log("Lat: " + venueLat);
            console.log("Lng: " + venueLng);

            $('#venues').append('<div class="artistVenueBtn" venue="' + venue + '"><p class ="artistVenueText">' + showDate + ' - ' + venue + ' - ' + city + '</p></div>');
        }
    });


}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Google Maps //

var map, service, infowindow, place;
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
    var input = document.getElementById('searchTxtMap');
    var searchBox = new google.maps.places.SearchBox(input);

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
            createMarker(place);
        }
    }
}

//  Function to create a marker for each place found in the search method.
function createMarker(place) {

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


//  Function to capture Venue name on user click and show map of venue
function showVenue() {

    //  Capturing name of selected venue from Upcoming shows list.
    let venue = $(this).attr("venue");

    //  Clearing markers
    setMapOnAll(null);
    markers = [];

    //  Object to store Google Places API Text Search parameters.
    var request = {
        query: venue,
        fields: ['name', 'geometry']
    };

    // Calling Google Places API Text Search Service
    service = new google.maps.places.PlacesService(map);

    //  Calling function to add marker and set map position based on which Venue user clicked
    service.findPlaceFromQuery(request, venueCallback);

    //  Changing map title
    $('#mapTitle').text(`Results for "${venue}"`);

    //  Showing map page
    showMap();
}


//  Google Map callback function for selected venue on artists page
function venueCallback(results) {

    //  Calling function to create marker for selected venue
    venueCreateMarker(results[0]);

    //  Setting center of map on venue
    map.setCenter(results[0].geometry.location);
}

//  Google map function for creating marker for selected venue on artists page
function venueCreateMarker(place) {

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
