const express = require('express');
const authController = require('../controllers/authController');
const timeTableController = require('../controllers/timeTableController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, timeTableController.getTimeTable)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    timeTableController.createTimeTable
  );

module.exports = router;
