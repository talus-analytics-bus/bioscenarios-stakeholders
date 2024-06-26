const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		index: { unique: true },
	},
	password: String,
	lastLoggedIn: Date,
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
	bcrypt.compare(password, this.password, callback);
};

UserSchema.statics.authenticate = (username, password, callback) => {
	User.findOne({ username }).exec((err, user) => {
		if (err) return callback(err);
		else if (!user) {
			var err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}

		bcrypt.compare(password, user.password, (err, result) => {
			if (result === true) return callback(null, user);
			return callback();
		});
	});
};

UserSchema.pre('save', function saveHook(next) {
	const user = this;
	if (!user.isModified('password')) return next();

	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) return next(saltError);

		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) return next(hashError);

			user.password = hash;
			return next();
		});
	});
});

module.exports = mongoose.model('User', UserSchema);