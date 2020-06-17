const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

const signToken = (id) => {
  //signing a signature token, creates new token based on these mixes of arguments passed in
  //generate token with user Id( from database) and secret(from server, in this case vsCode)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//The response sent back to the user with data
const createSendToken = (user, statusCode, res) => {
  //
  //create new token to send it back to user to use
  const token = signToken(user._id);

  //

  //persist the token as 'jwt' in cookie, with expiration date
  //cookie modification
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN *
          24 *
          60 *
          60 *
          1000
    ),
    //makes it so cookie cannot be modified by browser
    httpOnly: true,
  };
  //this means cookie will only be sent on an encrypted connection (https)
  if (process.env.NODE_ENV === 'production')
    //set cookieOptions variable to be secure
    cookieOptions.secure = true;
  //attaching cookie to response object
  //making token more secure by storing it in cookie for user
  // 'jwt' is the name you choose for the cookie
  res.cookie('jwt', token, cookieOptions);

  //

  user.password = undefined;

  //this is what you ONLY return back to user in JSON file
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user,
    },
  });
};

//

//

//

exports.getUsers = catchAsync(
  async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  }
);

exports.signup = catchAsync(async (req, res, next) => {
  //   const userExist = await User.findOne({
  //     email: req.body.email,
  //   });
  //   if (userExist)
  //     return res.status(403).json({
  //       error: 'Email is already taken!',
  //     });

  //

  /*You can't remove the user password from being outputted to 
  user(like getAll and signup) so you must do it in the Schema
  with select: false*/
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

//

//

exports.signin = catchAsync(async (req, res, next) => {
  //find user based on email
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      error: 'Please provide email and password!',
    });
  //find entire user account data, using search query of email
  const user = await User.findOne({ email }).select(
    '+password'
  );
  /*The 'correctPassword' Instance Method is created by you 
  in the UserSchema ready to be used anytime */
  if (
    !user ||
    !(await user.correctPassword(
      password,
      user.password
    ))
  ) {
    return res.status(401).json({
      error:
        'Incorrect email or password! Please try again.',
    });
  }
  createSendToken(user, 200, res);

  //return response containing user token to frontend client
});
