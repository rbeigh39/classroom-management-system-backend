const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have an author.'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must belong to a post.'],
  },
  comment: {
    type: String,
    required: [true, 'Comment cannot be empty'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: ['name', 'photo'],
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
