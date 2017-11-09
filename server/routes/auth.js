const express = require('express');
const passport = require('passport');

const router = new express.Router();
let isLoggedIn = false;

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

router.use((req, res, next) => {
	req.session.test8 = 'test9';
	next();
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
			isLoggedIn = true;
			res.send({ success: true, message: 'Success logging in!' });
		});
	})(req, res, next);
});

router.get('/verify', function(req, res, next) {
	return res.send({ loggedIn: isLoggedIn });
});

router.get('/logout', function(req, res, next) {
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	}
});

module.exports = router;