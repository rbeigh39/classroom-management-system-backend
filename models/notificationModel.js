const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['notification', 'notice'],
    default: 'notification',
  },
  title: {
    type: String,
    required: [true, 'Please enter the notification title (title)'],
  },
  message: {
    type: String,
    required: [true, 'Please enter the notification message (message)'],
  },
  type: {
    type: String,
    enum: ['general', 'important', 'critical'],
    default: 'general',
    required: [
      true,
      'A notification must have a type (general, important, critical)',
    ],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A notification must belong to a user! (login first)'],
  },
  link: {
    type: String,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
