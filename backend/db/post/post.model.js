const mongoose = require("mongoose")

const PostSchema = require('./post.schema').PostSchema;

const PostModel = mongoose.model("PostModel", PostSchema);
// create a new post
function createPost(post) {
    return PostModel.create(post);
}

//get all posts from DB
function returnAllPosts(){
    return PostModel.find().exec();
}

//find all posts related to username
function findPostByUsername(username) {
    return PostModel.find({username: username}).exec();
}

//delete post by id
function deletePost(postId) {
    return PostModel.deleteOne({_id: postId}).exec();
}

//find post by id
function findPostById(postId) {
    return PostModel.findById(postId).exec();
}

//update post content and timestamp by matching id
function updatePostById(postId, post) {
    return PostModel.updateOne({"_id": new mongoose.Types.ObjectId(postId)}, { $set: { "content": post.content, "timestamp": Date.now() }});
}

module.exports = {
    createPost,
    returnAllPosts,
    findPostByUsername,
    deletePost,
    findPostById,
    updatePostById
}