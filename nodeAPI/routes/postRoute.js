const express = require('express');
//
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', postController.getPosts);

router.post(
  '/createPost',
  authController.protect,
  postController.createPost
);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
