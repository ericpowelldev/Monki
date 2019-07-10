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