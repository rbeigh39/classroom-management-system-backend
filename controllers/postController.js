const multer = require('multer');
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const Post = require('../models/postModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((cur) => {
    if (allowedFields.includes(cur)) newObj[cur] = obj[cur];
  });

  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/posts');
  },
  filename: (req, file, cb) => {
    const extention = file.mimetype.split('/')[1];
    const fileName = `user-${req.user._id}-${Date.now()}.${extention}`;

    cb(null, fileName);
  },
});

const createPost = catchAsync(async (req, res, next) => {
  let fileName = undefined;

  if (!req.body.message && !req.file)
    return next(new AppError('Post must contain a message or an image!', 400));

  if (req.file) fileName = req.file.filename;

  const newPost = await Post.create({
    author: req.user._id,
    message: req.body.message,
    image: fileName,
  });

  res.status(201).json({
    status: 'success',
    message: 'created',
    data: {
      newPost,
    },
  });
});

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    return cb(new AppError('Not an image, please upload only images!', 400));

  cb(null, true);
};

const upload = multer({
  dest: 'public/img/posts',
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadPostPhoto = upload.single('image');

const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID.', 400));

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

const getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that Id.', 400));

  if (post.author.equals(req.user._id))
    return next(new AppError('You are not authorized to edit this post.', 400));

  const filteredBody = filterObj(req.body, 'message', 'image');
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateBeforeSave: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'post updated',
    data: {
      post,
    },
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) return next(new AppError('No Post found with that Id.', 400));

  res.status(204).json({
    status: 'success',
    message: 'deleted',
  });
});

module.exports = {
  uploadPostPhoto,
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
};
