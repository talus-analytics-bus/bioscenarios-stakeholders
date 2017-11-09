// NodeJS script for starting server and listening for HTTP requests
const app = require('express')();
const server = require('http').Server(app);
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const configDB = require('./config/database.js');

// connect to mongo database
mongoose.connect(configDB.url, {
	useMongoClient: true,
});

// use body parser
const bodyParser = require('body-parser');
app.use(bodyParser());

// add session middleware
app.use(session({
	secret: 'its a secret',
	resave: false,
	saveUninitialized: false,
}));

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

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// if no hash, send to index
app.get('/', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// if hash, send to requested resource
app.get(/^(.+)$/, sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/', req.params[0]));
});	

// start the HTTP Server
server.listen(process.env.PORT || 8888, function() {
	console.log('Server set up!');
	console.log(server.address());
});
