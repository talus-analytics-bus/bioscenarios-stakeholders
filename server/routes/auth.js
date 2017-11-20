const router = require('express').Router();
const passport = require('passport');

// set up rate limiter for auth routes
const rateLimit = require('express-rate-limit');
const limiter = new rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 10,
	delayMs: 0,
});
router.use('/', limiter);

// sign-up requests
router.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, token, info) {
		if (err) {
			console.log(err);
			return next(err);
		}
		return res.send({
			success: true,
			message: 'Success registering!',
		});
	})(req, res, next);
});

// login requests
router.post('/login', function(req, res, next) {
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
router.post('/logout', function(req, res, next) {
	req.logout();
	res.send({
		success: true,
		message: 'Success logging out!',
	});
});

module.exports = router;
