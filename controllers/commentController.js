const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const APIFeatures = require('../utilities/apiFeatures');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

const createComment = catchAsync(async (req, res, next) => {
  if (!req.body.comment)
    return next(new AppError('Please enter a comment!', 400));

  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('No post found with that id', 400));

  const newComment = await Comment.create({
    author: req.user._id,
    post: req.params.postId,
    comment: req.body.comment,
  });

  const new_comment = await Comment.populate(newComment, { path: 'author' });

  await Post.findByIdAndUpdate(req.params.postId, {
    $inc: { noOfComments: 1 },
  });

  res.status(201).json({
    status: 'success',
    message: 'post created',
    data: {
      newComment: new_comment,
    },
  });
});

const getAllComments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Comment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

const getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment)
    return next(new AppError('No comment found with that ID.', 400));

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

const getPostComments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Comment.find({ post: req.params.postId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment.author.equals(req.user._id))
    return next(
      new AppError('You are not authorized to update this comment', 400)
    );

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      comment: req.body.comment,
    },
    {
      new: true,
      validateBeforeSave: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'updated comment',
    data: {
      comment: updatedComment,
    },
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment)
    return next(new AppError('No comment found with that ID.', 400));

  if (!comment.author.equals(req.user._id))
    return next(
      new AppError('You are not authorized to delete this comment', 400)
    );

  const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

  await Post.findByIdAndUpdate(deletedComment.post, {
    $inc: { noOfComments: -1 },
  });

  if (!comment)
    return next(new AppError('No comment found with that ID.', 400));

  res.status(204).json({
    status: 'success',
    message: 'deleted',
    data: {
      comment: deletedComment,
    },
  });
});

const getUserComments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Comment.find({
      author: req.user._id,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

module.exports = {
  createComment,
  getAllComments,
  getComment,
  getPostComments,
  updateComment,
  deleteComment,
  getUserComments,
};
