const express = require('express');
//
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get(
  '/getUsers',
  authController.protect,
  userController.getUsers
);

//get user based on ID
router.get(
  '/:id',
  authController.protect,
  userController.getUserById
);

module.exports = router;
