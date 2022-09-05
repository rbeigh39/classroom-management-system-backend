const express = require("express");
const resourceController = require("../controllers/resourceController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(resourceController.getAllResources)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    resourceController.uploadResource,
    resourceController.createResource
  );

router
  .route("/:id")
  .get(resourceController.getResource)
  .patch(authController.protect, resourceController.updateResource)
  .delete(authController.protect, resourceController.deleteResource);

router.route("/download/:fileName").get(resourceController.downloadResource);

module.exports = router;
