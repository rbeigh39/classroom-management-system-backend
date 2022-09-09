const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

const router = express.Router();

// Protect all routes after this middleware:
router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.restrictTo('admin', 'cr', 'faculty'),
    postController.uploadPostPhoto,
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.uploadPostPhoto, postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
