const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      required: [true, 'A time-table should belong to a day of a week.'],
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
    },
    classes: [
      {
        startTime: {
          type: String,
          required: [true, 'A time-table entry must have a starting time'],
        },

        endTime: {
          type: String,
          required: [true, 'A time-table entry must have an end-time.'],
        },

        subject: {
          type: String,
          required: [true, 'A time-table entry must have a subject'],
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;
