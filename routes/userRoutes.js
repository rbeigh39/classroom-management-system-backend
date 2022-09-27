const express = require('express');
const userController = require('./../controllers/userController');
const postController = require('../controllers/postController');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/logout', authController.logout);

router.get('/getMyProfile', authController.protect, userController.getProfile);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.patch(
  '/updatePassword/',
  authController.protect,
  authController.updatePassword
);

router
  .route('/posts')
  .get(authController.protect, postController.getUsersPosts);

router
  .route('/likes')
  .get(authController.protect, likeController.getUserLikedPosts);

router
  .route('/comments')
  .get(authController.protect, commentController.getUserComments);

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
