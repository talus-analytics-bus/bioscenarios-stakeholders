const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const config = require('./config.json');

module.exports = (passport) => {
	passport.serializeUser((token, done) => {
		done(null, token);
	});

	passport.deserializeUser((token, done) => {
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
	}, (req, username, password, done) => {
		const userData = {
			username: username.trim(),
			password: password.trim(),
			lastLoggedIn: new Date(),
		};
		if (req.body.adminPassword === config.adminPassword) {
			const newUser = new User(userData);
			newUser.save((err) => {
				console.log(`User "${username}" created!`);
				if (err) return done(err);
				done(null, newUser);
			});
		} else {
			const error = new Error('Admin password is incorrect.');
			done(error);
		}
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	}, (req, username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
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

				// successful password match; update logged in date
				user.lastLoggedIn = new Date();
				user.save((err) => {
					if (err) {
						const error = new Error('Error saving user information.');
						return done(error);
					}
					const payload = { sub: user._id };
					const token = jwt.sign(payload, config.secret);
					return done(null, token, user.username);
				});
			});
		});
	}));
};
