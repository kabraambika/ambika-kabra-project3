const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        require: true,
        required: true
    },
    bio: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, { collection : 'users' });

