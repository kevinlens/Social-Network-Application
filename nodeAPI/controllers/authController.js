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
