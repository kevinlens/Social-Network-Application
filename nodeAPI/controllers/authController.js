const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  //   const userExist = await User.findOne({
  //     email: req.body.email,
  //   });
  //   if (userExist)
  //     return res.status(403).json({
  //       error: 'Email is already taken!',
  //     });
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(200).json({
    status: 'success',
    message: 'Signup sucessful! Please login!',
  });
});

exports.signin = catchAsync(async (req, res) => {
  //find user based on email
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      error: 'Please provide email and password!',
    });
  //find entire user account data, using search query of email
  const user = await User.findOne(email);

  if(!user || !(await user.correctPassword(password, user.password)){
    return res.status(401).json({
      error: 'Incorrect email or password! Please try again.'
    })
  }
  //generate token with user Id( from database) and secret(from server, in this case vsCode)
  //persist the token as 't' in cookie, with expiration date
  //return response containing user token to frontend client
});
