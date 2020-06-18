const express = require('express');
//
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', postController.getPosts);
router.post(
  '/post',
  authController.protect,
  postController.createPost
);

module.exports = router;
