const express = require("express");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.route("/").get(commentController.getAllComments);

router
  .route("/:postId")
  .get(commentController.getPostComments)
  .post(authController.protect, commentController.createComment);

router
  .route("/:commentId")
  //   .get(commentController.getComment) // Doesnt work as the id gets matched in the above route
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

module.exports = router;
