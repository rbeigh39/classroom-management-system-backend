const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const TimeTable = require('../models/timeTableModel');

const createTimeTable = catchAsync(async (req, res, next) => {
  const timeTable = await TimeTable.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Time-table successfully created!',
    data: {
      timeTable,
    },
  });
});

const getTimeTable = catchAsync(async (req, res, next) => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const currentDayIndex = new Date(Date.now()).getDay();
  console.log('this is the target: ', days[currentDayIndex]);

  const timeTable = await TimeTable.find({
    dayOfWeek: days[currentDayIndex],
  });

  res.status(200).json({
    status: 'success',
    data: {
      timeTable,
    },
  });
});

module.exports = {
  createTimeTable,
  getTimeTable,
};
