const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["notification", "notice"],
    default: "notification",
  },
  title: {
    type: String,
    required: [true, "Please enter the notificationTitle"],
  },
  message: {
    type: String,
    required: [true, "Please enter the notificationMessage"],
  },
  type: {
    type: String,
    enum: ["general", "important", "critical"],
    default: "general",
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
