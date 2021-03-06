const express = require('express');
//
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', postController.getPosts);

//

//ANYTHING that comes AFTER this point will have this middleware applied
router.use(authController.protect);
//ANYTHING that comes AFTER this point will have this middleware applied

//

router.post('/createPost', postController.createPost);

//===============================

router.get(
  '/getMyPosts',
  authController.protect,
  userController.getMe,
  postController.getMyPosts
);

//user are allowed to update name and email
router.patch(
  '/updateMyPost/:id',
  postController.updateMyPost
);

router.delete(
  '/deleteMyPost/:id',
  postController.deleteMyPost
);

//

//ANYTHING that comes AFTER this point will have this middleware applied
router.use(authController.restrictTo('admin'));
//ANYTHING that comes AFTER this point will have this middleware applied

//

router
  .route('/:id')
  .get(postController.getUsersPost)
  .patch(postController.updateUsersPost)
  .delete(postController.deleteUsersPost);

module.exports = router;
