const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		console.log('in serialize');
		done(null, 'test');
	});

	passport.deserializeUser(function(id, done) {
		console.log('in deserialize');
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	}, function(req, username, password, done) {
		const userData = {
			username: username.trim(),
			password: password.trim(),
		};
		const newUser = new User(userData);
		newUser.save(function(err) {
			console.log('user created!');
			if (err) return done(err);
			return done(null, newUser);
		});
	}));
};


/*const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index.json');

module.exports = new LocalStrategy({
	usernameField: 'emailOrUsername',
	passwordField: 'password',
	session: false,
	passReqToCallback: true,
}, (req, emailOrUsername, password, done) => {
	const userData = {
		emailOrUsername: emailOrUsername.trim(),
		password: password.trim(),
	};

	const isEmail = validator.isEmail(userData.emailOrUsername);
	const conditionals = isEmail ?
		{ email: userData.emailOrUsername } :
		{ username: userData.emailOrUsername };

	return User.findOne(conditionals, (err, user) => {
		if (err) return done(err);
		if (!user) {
			const error = new Error(`${isEmail ? 'Email' : 'Username'} not found.`);
			error.name = 'IncorrectCredentialsError';
			return done(error);
		}

		return user.comparePassword(userData.password, (passwordErr, isMatch) => {
			if (passwordErr) return done(passwordErr);
			if (!isMatch) {
				const error = new Error('Incorrect password.');
				error.name = 'IncorrectCredentialsError';
				return done(error);
			}

			const payload = { sub: user._id };
			const token = jwt.sign(payload, config.jwtSecret);
			return done(null, token, {
				email: user.email,
				username: user.username,
			});
		});
	});
});*/