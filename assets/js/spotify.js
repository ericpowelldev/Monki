function enter(s) {
    //console.log('>' + s);
}
function exit(s) {
    //console.log('<' + s);
}

function setCookie(key, value) {
    enter('setCookie');
    var expires = new Date();
    var minutes = 60; // expires in 60 minutes
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    exit('setCookie');
}

function getCookie(key) {
    enter('getCookie: ' + key);
    enter(document.cookie);
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    exit(keyValue);
    exit('getCookie');
    return keyValue ? keyValue[2] : null;
}

function clearCookie(key) {
    enter('clearCookie');
    var expires = new Date();
    var hours = -1; // expires in 1 hour ago
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
    document.cookie = key + '=;expires=' + expires.toUTCString();
    exit('setCookie');
}

function clearCookies() {
    document.cookie.split(';').forEach(function(c) {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
}

function setQueryParameters() {
    location.queryString = {};
    location.search
        .substr(1)
        .split('&')
        .forEach(function(pair) {
            if (pair === '') return;
            var parts = pair.split('=');
            location.queryString[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
        });
}

function setHashParameters() {
    location.hashString = {};
    if (window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        hash.split('&').forEach(function(pair) {
            if (pair === '') return;
            var parts = pair.split('=');
            location.hashString[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
        });
    }
}

spotify = {
    login: function(clientId, callbackURL) {
        enter('login');
        let authURL = 'https://accounts.spotify.com/authorize';
        var authLink = `${authURL}?client_id=${clientId}&response_type=token&redirect_uri=${callbackURL}`;
        // redirect to the spotify URL - it will call us back with #access_token
        window.location.replace(authLink);
        exit('login');
    },

    logout: function() {
        clearCookie('access_token');
    },

    error: function(results) {
        console.error(results.data);
        alert(`Problem with Spotify - did you login?\n${results.responseJSON.error.message}`);
    },

    call: function(url, data, callbackFunction) {
        $.ajaxSetup({
            headers: {
                Authorization: 'Bearer ' + getCookie('access_token')
            }
        });
        data.cacheBuster = new Date().getTime();
        data.url = url;
        let xhr = $.get(url, data, callbackFunction, 'json') //
            .fail(results => {
                results.data = data;
                spotify.error(results);
            });
    },

    setup: function() {
        // this is the first function called when the page loads
        // go get the hashparameters
        setHashParameters();
        setQueryParameters();

        if (location.hashString['access_token']) {
            // this is the callback with the #access_token on it
            // set the cookie so that it persists for other pages in our site
            setCookie('access_token', location.hashString['access_token']);
        }
    }
};
spotify.setup();
