const express = require('express');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(messageController.getAllMessages)
  .post(
    messageController.uploadMessagePhoto,
    messageController.resizeMessagePhoto,
    messageController.createMessage
  );

module.exports = router;
