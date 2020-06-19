const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

exports.getUserById = catchAsync(
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
