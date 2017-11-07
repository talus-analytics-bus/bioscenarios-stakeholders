// NodeJS script for starting server and listening for HTTP requests
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');

var mongoose = require('mongoose');
var configDB = require('./config/index.json');
mongoose.createConnection(configDB.dbUri);

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


// if no hash, send to index
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, function(req, res) {
	res.sendFile(path.join(__dirname, '/', req.params[0]));
});	

app.post('/login', passport.authenticate('local'), function(req, res) {
	console.log('logging in...');
});

// Start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
