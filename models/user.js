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

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
	bcrypt.compare(password, this.password, callback);
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