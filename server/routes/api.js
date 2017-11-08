const express = require('express');
const router = new express.Router();

// sign-up requests
router.get('/dashboard', (req, res) => {
	res.status(200).json({
		message: 'Yea',
	});
});

module.exports = router;