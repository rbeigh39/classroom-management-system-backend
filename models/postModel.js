const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A post must have an author'],
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    noOfLikes: {
      type: Number,
      default: 0,
    },
    noOfComments: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'post',
  localField: '_id',
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'likes',
    select: ['-__v'],
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
