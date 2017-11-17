// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');

// grab config object
const config = require('./config/database.js');

// initialize express session and other parsers
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(session({ secret: 'cats' }));
app.use(bodyParser.urlencoded({ extended: false }));

// connect to mongo database
const mongoose = require('mongoose');
mongoose.connect(config.url, {
	useMongoClient: true,
});

// set up passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// check if user is logged in
app.use((req, res, next) => {
	console.log(req.user);
	next();
});

// if no hash, send to index
app.get('/', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/', req.params[0]));
});

// sign-up requests
app.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, token, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(token, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			isLoggedIn = true;
			return res.send({
				success: true,
				token,
				message: 'Success registering!',
			});
		});
	})(req, res, next);
});

// login requests
app.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, token, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(token, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			isLoggedIn = true;
			res.send({
				success: true,
				token,
				message: 'Success logging in!',
			});
		});
	})(req, res, next);
});

// script for verifying logged in status
app.post('/verify', function(req, res, next) {
	return res.send({ loggedIn: 'maybe' }).end();
});

// log out script
app.get('/logout', function(req, res, next) {
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	}
});

// start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
