const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A message must have an author!'],
    },
    message: {
      type: String,
    },
    photo: {
      type: String,
    },
    downloadLink: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: ['name', 'photo', '_id'],
  });

  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
