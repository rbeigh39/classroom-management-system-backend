const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users/");
//   },
//   filename: (req, file, cb) => {
//     const extention = file.mimetype.split("/")[1];
//     const fileName = `user-${req.user.id}-${Date.now()}.${extention}`;

//     cb(null, fileName);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images.', 400), false);
  }
};

const upload = multer({
  dest: 'public/img/users/',
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize({
      width: 500,
      height: 500,
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((cur) => {
    if (allowedFields.includes(cur)) newObj[cur] = obj[cur];
  });

  return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const createUser = (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet implemented!',
  });
};

const getUser = (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet implemented!',
  });
};

const updateUser = (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet implemented!',
  });
};

const deleteUser = (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet implemented!',
  });
};

const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword instead',
        400
      )
    );

  // 2. Update user document
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo', 'tagLine');

  if (req.file) filteredBody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    validateBeforeSave: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    message: 'user deleted',
    data: {
      user,
    },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto,
};
