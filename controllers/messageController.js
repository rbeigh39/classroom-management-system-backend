const multer = require('multer');
const sharp = require('sharp');
const Message = require('../models/messagesModel');
const AppError = require('../utilities/appError');
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images.', 400), false);
  }
};

const upload = multer({
  dest: 'public/img/messages/',
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadMessagePhoto = upload.single('photo');

const resizeMessagePhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 70 })
    .toFile(`public/img/messages/${req.file.filename}`);

  next();
};

const createMessage = catchAsync(async (req, res, next) => {
  console.log('this is from message controller!');
  console.log(req.file);

  if (!req.body.message && !req.file)
    return next(
      new AppError('Please add a message or attach a file or a photo')
    );

  const newMessage = await Message.create({
    author: req.user._id,
    message: req.body.message,
    photo: req.file ? req.file.filename : undefined,
  });

  const new_message = await Message.populate(newMessage, { path: 'author' });

  res.status(201).json({
    status: 'success',
    data: {
      message: new_message,
    },
  });
});

const getAllMessages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Message.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const messages = await features.query;

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages,
    },
  });
});

const updateMessage = catchAsync(async (req, res, next) => {
  res.end('updating a message!');
});

const deleteMessage = catchAsync(async (req, res, next) => {
  res.end('deleting a message');
});

module.exports = {
  uploadMessagePhoto,
  resizeMessagePhoto,
  createMessage,
  getAllMessages,
  deleteMessage,
};
