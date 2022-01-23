var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

function createUser(newUser, callback) {
    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

function getUserByUserName(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

function getUserById(id, callback) {
    User.findById(id, callback);
};

function comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.createUser = createUser;
module.exports.getUserByUserName = getUserByUserName;
module.exports.getUserById = getUserById;
module.exports.comparePassword = comparePassword;
