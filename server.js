const express = require('express');
const app = express();
var port = process.env.PORT || 80;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res) {
    console.log('static file request : ' + req.params);
    res.sendFile(__dirname + req.params[0]);
});

app.listen(port, err => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
