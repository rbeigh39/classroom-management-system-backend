const mongoose = require('mongoose');
// const Post = require('../models/postModel');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A like must belong to a User.'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'A like must belong to a Post'],
  },
});

likeSchema.index({ post: 1, user: 1 }, { unique: true });

// likeSchema.methods.checkIfPostExists = async function (postId) {
//   const post = await Post.findById(postId);

//   if (!post) return false;
//   return true;
// };

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
