const express = require('express');
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware:
router.use(authController.protect);

router
  .route('/')
  .get(notificationController.getAllNotifications)
  .post(
    authController.restrictTo('admin', 'cr', 'faculty'),
    notificationController.createNotification
  );

router
  .route('/:id')
  .get(notificationController.getNotification)
  .patch(
    authController.restrictTo('admin', 'cr', 'faculty'),
    notificationController.updateNotification
  )
  .delete(
    authController.restrictTo('admin', 'cr', 'faculty'),
    notificationController.deleteNotification
  );

module.exports = router;
