// NodeJS script for starting server and listening for HTTP requests
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var configDB = require('./config/database.js');

// connect to mongo database
mongoose.connect(configDB.url, {
	useMongoClient: true,
});

// use body parser
var bodyParser = require('body-parser');
app.use(bodyParser());

// add session middleware
app.use(session({
	secret: 'its a secret',
	resave: true,
	saveUninitialized: false,
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// check logged in state
const authCheckMiddleware = require('./server/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// if no hash, send to index
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, function(req, res) {
	res.sendFile(path.join(__dirname, '/', req.params[0]));
});	

// start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
