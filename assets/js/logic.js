// var clientSecret = '8238cc51bc5b44d08a898fee93208f2a'; // Unknown what this actually does

// Global Variables
var spotifyQueryURL = 'https://api.spotify.com/v1/';

var userInput = ''; // User input from search bar
var spotifyID = ''; // Generated ID for search result
var songkickName = ''; // Generated name for search result

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
    $("#searchTxt").empty();
    $("#searchTxtNav").empty();
    showHome();
}

/////////////////////// RESULT PAGE ///////////////////////
// Get user input
function homeSearch() {
    userInput = $("#searchTxt").val().trim();
    $("#searchTxt").empty();
    resultPage();
}
// Get user input
function navSearch() {
    userInput = $("#searchTxtNav").val().trim();
    $("#searchTxtNav").empty();
    resultPage();
}

function resultPage() {
    console.log(userInput);

    if (userInput !== "" && userInput !== undefined) {
        // Call Spotify result
        spotify.call(
            `${spotifyQueryURL}search`,
            { q: userInput, type: 'artist', market: 'US', limit: '20', offset: '0' },
            spotifyResult
        );
    }
    else {
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
    for(var i = 0; i < 20; i++) {
        if (data.artists.items[i] !== undefined && data.artists.items[i].images.length !== 0) {
            var newSearchLink = $(`<a class="resultBtn" href="#" data-id="${data.artists.items[i].id}" data-name="${data.artists.items[i].name}">`);
            var newSearchDiv = $(`<div class="resultBox">`);
            var newSearchImage = $(`<img src="${data.artists.items[i].images[0].url}" class="resultImage">`);
            var newSearchName = $(`<p class="resultName">`);
            newSearchName.text(data.artists.items[i].name);
            newSearchDiv.append(newSearchImage);
            newSearchDiv.append(newSearchName);
            newSearchLink.append(newSearchDiv);
            $("#results").append(newSearchLink);
        }
        else if (data.artists.items[0] == undefined) {
            $("#resultTitle").text(`No artist results for "${userInput}"`);
            continue;
        }
        else {
            console.log("Artist does not exist or is missing parameters, skipping...");
        }
    }

    // Show HTML
    showResult();
}

/////////////////////// ARTIST PAGE ///////////////////////
function artistPage() {
    // Get Spotify artist ID & artist name
    spotifyID = $(this).attr("data-id");
    songkickName = $(this).attr("data-name");

    console.log(spotifyID + songkickName);

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
    $("#linkWeb").attr("target", "_blank");
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
}

$(document).on("click", "#navBtn", showHome);
$(document).on("click", "#searchBtn", homeSearch);
$(document).on("click", "#searchBtnNav", navSearch);
$(document).on("click", "#searchBtnMap", mapPage);
$(document).on("click", ".resultBtn", artistPage);
$(document).on("click", ".artistVenueBtn", mapPage);
$(document).on("click", "#mapBtn", mapPage);
$(document).on("click", "#loginBtn", spotifyLogin);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Song Kick //

var songkickArtistID, venue, venueLat, venueLng, city, date, venueLocation;

function getArtistID() {
    //  Example ARTIST for testing purposes until artistName variable is linked to a searched result.
    artistName = "Maroon 5"
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

            $('.artistBoxMedium').append('<div class="artistVenueBtn"><p class ="artistVenueText">' + showDate + ' - ' + venue + ' - ' + city + '</p></div>')


        }
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Google Maps //

var map, service, infowindow;
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



getArtistID();