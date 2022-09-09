const express = require('express');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Protect all routes after this middleware:
router.use(authController.protect);

router.route('/').get(commentController.getAllComments);

router
  .route('/:postId')
  .get(commentController.getPostComments)
  .post(commentController.createComment);

router
  .route('/:commentId')
  //   .get(commentController.getComment) // Doesnt work as the id gets matched in the above route
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
