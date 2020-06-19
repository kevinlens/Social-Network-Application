const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

//'...allowedFields' is an array created by default containing all arguments passed
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  //If the users 'obj' req.body contain the required fields from the array 'allowedFields', then create new object that includes propertie name equal to field names
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  //should return back an object with properties
  return newObj;
};

// ---------------------------------------------------

exports.getMe = (req, res, next) => {
  //If you are logged then req.user.id should already be available
  //set the params id up so you dont have to manually add it
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(
  async (req, res, next) => {
    const doc = await User.findById(req.params.id);
    if (!doc) {
      res.status(404).json({
        message: 'No document found with that ID',
      });
    }

    //
    /*send back the response as a json object(specially for 'status')
    because 'docs' is already one */
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  }
);

exports.updateAccount = catchAsync(
  async (req, res, next) => {
    //
    if (
      req.body.password ||
      req.body.passwordConfirm
    ) {
      res.status(400).json({
        message:
          'This route is not for password updates. Please use the route /updateMyPassword',
      });
    }

    //grabs the user's req.body and filter out(select) only their updated'name','email'
    //this is special function you built at the very top of this document
    const filteredBody = filterObj(
      req.body,
      'name',
      'email'
    );
    //
    //update user info with adjusted object properties
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        //setting it as a "new" document
        new: true,
        //like if email is actually a legit one
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

exports.getUsers = catchAsync(
  async (req, res, next) => {
    const users = await User.find().select('-__v');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  }
);
