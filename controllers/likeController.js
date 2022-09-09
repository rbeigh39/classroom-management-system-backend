const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");

const createLike = catchAsync(async (req, res, next) => {
  const postID = req.body.post;

  if (!(await Post.findById(postID)))
    return next(new AppError("No post found with that ID.", 400));

  const like = await Like.create({
    user: req.user._id,
    post: postID,
  });

  res.status(201).json({
    status: "success",
    message: "Like Created!",
    data: {
      like,
    },
  });
});

const getIfUserHasLiked = catchAsync(async (req, res, next) => {
  res.end("getting if the user has liked the post");
});

const deleteLike = catchAsync(async (req, res, next) => {
  const deletedLike = await Like.findOneAndDelete({
    post: req.body.post,
    user: req.user._id,
  });

  if (!deletedLike)
    return next(new AppError("couldn't find your comment!"), 400);

  res.status(204).json({
    status: "success",
    message: "deleted a comment",
    data: {
      deletedLike,
    },
  });
});

module.exports = {
  createLike,
  getIfUserHasLiked,
  deleteLike,
};
