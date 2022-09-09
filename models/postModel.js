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

// postSchema.virtual('heya').get(function () {
//   return 'hello';
// });
// postSchema.virtual("isLikedByMe").get(async function () {
//   // this points to the current document
//   const like = await Like.findOne({
//     post: this._id,
//   });

//   if (!like) {
//     return "false";
//   }

//   return "true";
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
