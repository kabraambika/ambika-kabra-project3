const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema;

const UserModel = mongoose.model("UserModel", UserSchema);

//create a new user
function createUser(user) {
    return UserModel.create(user);
}

//find user by username
function findUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

module.exports = {
    createUser,
    findUserByUsername,
}