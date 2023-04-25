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

function updateUserBio(username, bioContent) {
    return UserModel.updateOne({"username": username}, { $set: { "bio": bioContent}});
}

function getAllUsers() {
    return UserModel.find().exec();
}
module.exports = {
    createUser,
    findUserByUsername,
    updateUserBio,
    getAllUsers
}