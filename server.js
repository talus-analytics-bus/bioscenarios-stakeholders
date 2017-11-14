// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const configDB = require('./config/database.js');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser());
app.use(cookieParser());

// connect to mongo database
mongoose.connect(configDB.url, {
	useMongoClient: true,
});

// define session checker
const sessionChecker = (req, res, next) => {
	next();
};

// set up passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// check logged in state
const authCheckMiddleware = require('./server/auth-check');
app.use('/api', authCheckMiddleware);

// if no hash, send to index
app.get('/', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, sessionChecker, (req, res) => {
	console.log(req.cookies);
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
			res.cookie('token', token);
			return res.send({ success: true, message: 'Success registering!' });
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
			res.cookie('token', token);
			res.send({ success: true, message: 'Success logging in!' });
		});
	})(req, res, next);
});

// script for verifying logged in status
app.post('/verify', function(req, res, next) {
	if (req.cookies.token) {
		return res.send({ loggedIn: true });
	}
	return res.send({ loggedIn: false });
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
