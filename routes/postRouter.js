const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.uploadPostPhoto,
    postController.createPost
  );

router
  .route("/:id")
  .get(postController.getPost)
  .patch(
    authController.protect,
    postController.uploadPostPhoto,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
