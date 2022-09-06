const Notification = require("../models/notificationModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const APIFeatures = require("../utilities/apiFeatures");

const createNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Notification successfully created",
    data: {
      notification,
    },
  });
});

const getAllNotifications = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Notification.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const notifications = await features.query;

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

const getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification)
    return next(new AppError("No notification found with that ID", 400));

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

const updateNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

const deleteNotification = catchAsync(async (req, res, next) => {
  const deletedNotification = await Notification.findByIdAndDelete(
    req.params.id
  );

  if (!deletedNotification)
    return next(new AppError("No notification found with that ID", 400));

  res.status(204).json({
    status: "success",
    message: "deleted",
    data: {
      notification: deletedNotification,
    },
  });
});

module.exports = {
  createNotification,
  getAllNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
};
