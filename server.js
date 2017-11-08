// NodeJS script for starting server and listening for HTTP requests
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');

var passport = require('passport');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, {
	useMongoClient: true,
});

var bodyParser = require('body-parser');
app.use(bodyParser());

// set up passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// if no hash, send to index
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, function(req, res) {
	res.sendFile(path.join(__dirname, '/', req.params[0]));
});	

app.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(user, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			return res.send({ success: true, message: 'Success registering!' });
		});
	})(req, res, next);
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(user, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			return res.send({ success: true, message: 'Success logging in!' });
		});
	})(req, res, next);
});

// Start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
