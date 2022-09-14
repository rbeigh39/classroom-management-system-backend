const multer = require('multer');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Resource = require('../models/resourceModel');
const APIFeatures = require('../utilities/apiFeatures');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/resources');
  },
  filename: (req, file, cb) => {
    let ext;

    if (file.mimetype.includes('.document')) {
      console.log('one');
      ext = 'docx';
    } else if (file.mimetype.includes('.presentation')) {
      console.log('two');
      ext = 'pptx';
    } else {
      ext = file.mimetype.split('/')[1];
    }

    cb(null, `resource-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image. Plesase upload only images', 400));
  }
};

const upload = multer({
  storage: multerStorage,
});

const uploadResource = upload.single('file');

const getAllResources = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Resource.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const resources = await features.query;

  res.status(200).json({
    status: 'success',
    results: resources.length,
    data: {
      resources,
    },
  });
});

const searchResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findOne({ title: req.params.title });

  if (!resource)
    return next(new AppError('No resources found with that title', 404));

  res.status(200).json({
    status: 'success',
    data: {
      Resource,
    },
  });
});

const getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource)
    return next(new AppError('No resource found with that ID', 400));

  res.status(200).json({
    status: 'success',
    data: {
      resource,
    },
  });
});

const createResource = catchAsync(async (req, res, next) => {
  if (!req.body.type === 'link' || !req.body.type === 'attachment')
    return next(new AppError('Please select a resource type!'));

  if (req.body.type === 'attachment' && !req.file)
    return next(new AppError('Please attach a file!', 400));

  if (req.body.type === 'attachment ') req.body.fileName = req.file.filename;

  if (
    req.body.type === 'link' &&
    !req.body.link &&
    req.body.link.replace(/\s+/g, '') === ''
  )
    return next(new AppError('Please attach a link!'));

  const resource = await Resource.create({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    fileName: req.body.fileName,
    author: req.user._id,
    link: req.body.link,
  });

  res.status(200).json({
    status: 'success',
    data: {
      resource,
    },
  });
});

const updateResource = catchAsync(async (req, res, next) => {
  res.end('this route is not yet implemented!');
});

const deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findOneAndDelete({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!resource)
    return next(new AppError('You have no resource with that ID.', 400));

  res.status(204).json({
    status: 'success',
    message: 'deleted',
    data: {
      resource,
    },
  });
});

const downloadResource = catchAsync(async (req, res, next) => {
  const path = `./public/resources/${req.params.fileName}`;
  res.download(path);
});

module.exports = {
  searchResource,
  getAllResources,
  getResource,
  createResource,
  uploadResource,
  updateResource,
  deleteResource,
  downloadResource,
};
