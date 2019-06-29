// Storing click data in Firebase
// This section explains the code that stores data in Firebase, about mouse-clicks on the map.

// For every mouse-click on the map, the code below creates a global data object and stores its information in Firebase. 
// This object records data like its latLng, and time-stamp of the click, as well as a unique ID of the browser that created the click.

/**
 * Data object to be written to Firebase.
 */
var data = {
    sender: null,
    timestamp: null,
    lat: null,
    lng: null
};