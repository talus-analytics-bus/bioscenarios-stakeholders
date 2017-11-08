const express = require('express');
const passport = require('passport');

const router = new express.Router();

// sign-up requests
router.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(user, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			return res.send({ success: true, message: 'Success registering!' });
		});
	})(req, res, next);
});


// login requests
router.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		req.login(user, function(err) {
			if (err) {
				console.log(err);
				return next(err);
			}
			console.log(user);
			return res.send({ success: true, message: 'Success logging in!' });
		});
	})(req, res, next);
});

module.exports = router;