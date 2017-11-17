const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const config = require('./database.js');

module.exports = function(passport) {
	passport.serializeUser(function(token, done) {
		done(null, token);
	});

	passport.deserializeUser(function(token, done) {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) return done(err);
			User.findById(decoded.sub, (err, user) => {
				done(err, user);
			});
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

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	}, function(req, username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) return done(err);
			if (!user) {
				const error = new Error('Username not found.');
				error.name = 'IncorrectCredentialsError';
				return done(error);
			}

			return user.comparePassword(password, (passwordErr, isMatch) => {
				if (passwordErr) return done(passwordErr);
				if (!isMatch) {
					const error = new Error('Incorrect password.');
					error.name = 'IncorrectCredentialsError';
					return done(error);
				}

				const payload = { sub: user._id };
				const token = jwt.sign(payload, config.secret);
				return done(null, token, {
					email: user.email,
					username: user.username,
				});
			});
		});
	}));
};
