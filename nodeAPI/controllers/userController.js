const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

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
