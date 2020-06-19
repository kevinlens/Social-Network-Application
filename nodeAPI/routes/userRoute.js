const express = require('express');
//
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

//ANYTHING that comes AFTER this point will have this middleware applied
router.use(authController.protect);
//ANYTHING that comes AFTER this point will have this middleware applied

router.get('/users', userController.getUsers);

//get user based on ID
router.get('/users/:id', userController.getUserById);

module.exports = router;
