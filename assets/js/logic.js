var map;
var service;
var infowindow;
var markers = [];


// Function to load map and ask for Geolocation.  Will run after DOM is loaded.
function initialize() {
    // Starting map location is set to New York, NY.  This can be changed.
    var startingMap = new google.maps.LatLng(40.713, -74.006);
    //  Grabing Map div on DOM and filling with a default map location.
    map = new google.maps.Map(document.getElementById('map'), {
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