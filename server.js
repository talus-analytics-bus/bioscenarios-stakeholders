// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');

// grab config object
const config = require('./server/config.json');

// initialize express session and other parsers
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(session({
	secret: config.secret,
	resave: true,
	saveUninitialized: false,
}));
app.use(bodyParser.json());

// connect to mongo database
const mongoose = require('mongoose');
mongoose.connect(config.url, {
	useMongoClient: true,
});

// set up passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./server/passport')(passport);

// set up auth routes
app.use('/auth', require('./server/routes/auth'));

// define resources that do not need authentication for user to access
const noAuthScripts = [
	'/login.html',
	'/login.html/',
	'/lib/jquery-3.2.1.min.js',
	'/lib/jquery.noty.packaged.min.js',
	'/js/auth.js',
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

// start the HTTP Server
server.listen(process.env.PORT || 8800, function() {
	console.log('Server set up!');
	console.log(server.address());
});
