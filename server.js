// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');

// grab config object
const config = require('./config/database.js');

// initialize express session and other parsers
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(session({
	secret: 'cats',
	resave: true,
	saveUninitialized: false,
}));
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

// define resources that do not need authentication for user to access
const noAuthScripts = [
	'/login.html',
	'/login.html/',
	'/lib/jquery-3.2.1.min.js',
	'/lib/jquery.noty.packaged.min.js',
	'/js/pages/login.js',
	'/css/main.css',
	'/css/main.css.map',
	'/css/bootstrap.min.css',
	'/css/bootstrap.min.css.map',
	'/img/talus-logo.png',
	'/img/favicon.ico',
];

// if no hash, send to index
app.get('/', (req, res) => {
	if (!req.user) return res.redirect('/login.html');
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// send to requested resource (check for user auth if script is protected)
app.get(/^(.+)$/, (req, res) => {
	const scriptPath = req.params[0];
	if (!req.user) {
		// user has not been authenticated; block scripts
		if (scriptPath === '/index.html' || scriptPath === '/index.html/') {
			return res.redirect('/login.html');
		}
		if (!noAuthScripts.includes(scriptPath)) {
			return res.end();
		}
	}
	res.sendFile(path.join(__dirname, '/', scriptPath));
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
			return res.send({
				success: true,
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
			res.send({
				success: true,
				message: 'Success logging in!',
			});
		});
	})(req, res, next);
});

// log out script
app.post('/logout', function(req, res, next) {
	req.logout();
	res.send({
		success: true,
		message: 'Success logging out!',
	});
});

// start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
