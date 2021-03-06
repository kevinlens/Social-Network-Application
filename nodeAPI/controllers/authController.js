const jwt = require('jsonwebtoken');
//util already comes built-in with node
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

const signToken = (id) => {
  //signing a signature token, creates new token based on these mixes of arguments passed in
  //generate token with user Id( from database) and secret(from server, in this case vsCode)
  /*Token will be generated based on user info, if it were to be sent back to server
  and somehow the secret has been changed then it will know because it also 
  has its own secret stored in the server which could not be changed.
  e.g would be someone trying to change user--> admin, but in order
  to do that you also have to change the servers SECRET*/
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
  //90days----> miliseconds(formula: 24*60*60*1000)
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
  /*Once the password is stored in Database we remove it in the
  document and send the rest of the document data to user*/
  user.password = undefined;

  //this is what you ONLY return back to user in JSON file
  res.status(statusCode).json({
    status: 'Success',
    token,
    user,
  });
};

//

//

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

//

//To signout we have to clear the cookie
exports.signout = (req, res) => {
  res.clearCookie('jwt');
  return res
    .status(200)
    .json({ message: 'Signout Successful!' });
};

//

//

//

//

//

//AUTHORIZATION

//Checks to see if user is authorized
exports.protect = catchAsync(
  async (req, res, next) => {
    // 1) Get token and check to see if its there
    let token;
    /*checks to see if the header has authorization mode set up
    and see if it also starts with 'Bearer'*/
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // .split('') will always remove the space and create an array of the two
      //we pick the [1] because it holds the token we want
      token = req.headers.authorization.split(' ')[1];
    }
    //if the token does not exist
    if (!token) {
      return res.status(401).json({
        error:
          'You are not logged in! Please log in to get access',
      });
    }
    // 2) Verifies/Compare users token JWT_SECRET with servers(vsCode) JWT_SECRET
    /*if verification fails then the program stops and throws and error probably because
    someone messed with the JWT_SECRET*/
    //if successful, it logs the destructured token
    /* { id: '5ed5786cf61bae4d4ad723b6',
        iat: 1591048302,
        exp: 1598824302 } */
    //jwt doesn't have its own promise handler so promisify will do
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //grabs the user Id
    const currentUser = await User.findById(
      decoded.id
    );

    // 3) Check if user changed password after the token was issued
    if (!currentUser) {
      res.status(401).json({
        error:
          'The user belonging to the token no longer exist, sorry.😢',
      });
    }

    // 4) Check if user changed password after the token was issued because if so then the token is different from before
    //iat stands for token 'ISSUED AT', basically an entire date()
    if (
      currentUser.changedPasswordAfter(decoded.iat)
    ) {
      return res.status(401).json({
        error:
          'User recently changed password! Please log in again',
      });
    }
    //
    //If none of the above is true, then grant access to protected route down below
    //setting user to id for later use
    /*This is important because it sets up the user info for the 
    rest of the express application without having to get the user
    by id over and over. It is so that you can use the currently 
    logged in user's info*/
    req.user = currentUser;
    next();
  }
);

/*this always creates an array when you do the '...roles' from the parameter,
and RESTRICT access only to specific roles*/
// e.g: [roles1, roles2]
exports.restrictTo = (...roles) => {
  //returns this middleware function which has access to the '...roles' parameter
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'], if req.user.role="user" then you don't have permission
    /*for more info about 'req.user' take a look at authController
   .protect() function*/
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error:
          'You do not have permission to perform this action',
      });
    }
    next();
  };
};
