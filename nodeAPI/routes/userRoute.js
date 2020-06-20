const express = require('express');
//
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

//

//ANYTHING that comes AFTER this point will have this middleware applied
router.use(authController.protect);
//ANYTHING that comes AFTER this point will have this middleware applied

//

//get all user along with their info
router.get('/users', userController.getUsers);

//set params ID to current logged in user's Id so they don't have to do it manually
//get user along with their info based on params ID and send it back
//user use this info to see what they would like to update
router.get(
  '/users/myAccount',
  userController.getMe,
  userController.getUser
);

//user are allowed to update name and email
router.patch(
  '/users/updateAccount',
  userController.updateAccount
);

router.delete(
  '/users/deleteAccount',
  userController.deleteAccount
);

//

//ANYTHING that comes AFTER this point will have this middleware applied
router.use(authController.restrictTo('admin'));
//ANYTHING that comes AFTER this point will have this middleware applied

//

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
