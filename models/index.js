const mongoose = require('mongoose');

module.exports.connect = (uri) => {
	mongoose.connect(uri, {
		useMongoClient: true,
	});
	mongoose.Promise = global.Promise;

	const db = mongoose.connection;
	db.on('error', (err) => {
		console.error(`Mongoose connection error: ${err}`);
		process.exit(1);
	});
	db.once('open', () => {
		console.log('connected to database!')
	});

	require('./user');
}