// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('./config/database.js');
const mongoose = require('mongoose');
const passport = require('passport');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser());
app.use(cookieParser());

// local variable to keep track of logged in state
let isLoggedIn = false;

// connect to mongo database
mongoose.connect(config.url, {
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
	// TODO this needs to move to parent level
	return res.send({ loggedIn: isLoggedIn }).end();

	/*const User = mongoose.model('User');
	const token = req.body.token;
	console.log('verifying token...: ' + token);

	// token is undefined
	if (!token || token === 'undefined') {
		res.redirect('/#login');
		return res.send({ loggedIn: false }).end();
	}

	// verify token
	return jwt.verify(token, config.secret, (err, decoded) => {
		// the 401 code is for unauthorized status
		console.log(decoded);
		if (err) { return res.status(401).end(); }

		const userId = decoded.sub;

		// check if a user exists
		return User.findById(userId, (userErr, user) => {
			if (userErr || !user) {
				return res.status(401).end();
			}

			return next();
		});
	});*/
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
