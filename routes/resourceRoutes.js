const express = require('express');
const resourceController = require('../controllers/resourceController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware:
router.use(authController.protect);

router
  .route('/')
  .get(resourceController.getAllResources)
  .post(
    authController.restrictTo('admin', 'cr', 'faculty'),
    resourceController.uploadResource,
    resourceController.createResource
  );

router
  .route('/:id')
  .get(resourceController.getResource)
  .patch(resourceController.updateResource)
  .delete(resourceController.deleteResource);

router.route('/download/:fileName').get(resourceController.downloadResource);

module.exports = router;
