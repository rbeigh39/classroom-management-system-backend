const express = require("express");
const authController = require("../controllers/authController");
const likeController = require("../controllers/likeController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, likeController.createLike)
  .delete(authController.protect, likeController.deleteLike);

module.exports = router;
