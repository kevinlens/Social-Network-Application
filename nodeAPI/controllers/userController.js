const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const bcrypt = require('bcryptjs');
//(to parse form data, like file uploads/images)
const formidable = require('formidable');
//this stands for 'file system' its to read files and its built-in
const fs = require('fs');

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
  /*for more info about 'req.user' take a look at authController
  .protect() function*/
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(
  async (req, res, next) => {
    const doc = await User.findById(req.params.id);
    if (!doc) {
      res.status(404).json({
        error: 'No document found with that ID',
      });
    }

    //
    /*send back the response as a json object(specially for 'status')
    because 'docs' is already one */
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  }
);

exports.updateAccount = catchAsync(
  async (req, res, next) => {
    //
    // if (
    //   req.body.password ||
    //   req.body.passwordConfirm
    // ) {
    //   res.status(400).json({
    //     error:
    //       'This route is not for password updates. Please use the route /updateMyPassword',
    //   });
    // }
    //
    let bod = req.body;
    if (bod.password !== undefined)
      bod.password = await bcrypt.hash(
        bod.password,
        12
      );

    //
    //grabs the user's req.body and filter out(select) only their updated'name','email'
    //this is special function you built at the very top of this document
    const filteredBody = filterObj(
      bod,
      'name',
      'email',
      'password'
    );
    //
    //update user info with adjusted object properties
    const updatedUser = await User.findByIdAndUpdate(
      /*for more info about 'req.user' take a look at authController
      .protect() function*/
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
      user: updatedUser,
    });
  }
);

exports.deleteAccount = catchAsync(
  async (req, res, next) => {
    /*Here I am trying make it so that one the account has been disabled
    the email could be reused but the former email data belonging to
    the account never gets lost*/
    const random = Math.random().toString();
    /*for more info about 'req.user' take a look at authController
    .protect() function*/
    const userEmail = req.user.email.concat(random);
    /* Note: By setting it to 'active: false', in order to query and 
    getAll() users with ONLY 'active: true' you have to already
    set it to '.find({active: true})', in your User.Schema Mode*/
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
      email: userEmail,
    });
    res.clearCookie('jwt');
    res.status(200).json({
      status: 'success',
      message: 'Account has been removed',
    });
  }
);

//=============================================================

//-----------------------------------------------------------
//---------------------ADMIN ONLY--------------------------

exports.getUsers = catchAsync(
  async (req, res, next) => {
    const users = await User.find().select('-__v');

    res.status(200).json({
      status: 'success',
      results: users.length,
      users,
    });
  }
);

exports.updateUser = catchAsync(
  async (req, res, next) => {
    //
    let bod = req.body;
    if (bod.password !== undefined)
      bod.password = await bcrypt.hash(
        bod.password,
        12
      );

    //
    const doc = await User.findByIdAndUpdate(
      req.params.id,
      bod,
      {
        //this states that the document is new
        new: true,
        runValidators: true,
      }
    );
    //
    if (!doc) {
      res.status(404).json({
        error: 'No document found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  }
);

// exports.updateUser = catchAsync(
//   async (req, res, next) => {
//     /*When you are using form data like this one you have to 
//   go in Postman and use 'x-www-form-urlencoded' instead 'raw'*/
//     //formidable package method that will give us form fields
//     // Conventionally people use this to upload files (like Images,Audios,etc )
//     let form = new formidable.IncomingForm();
//     /*tells the form to keep the file upload's in its format of jpeg,png,ect */
//     form.keepExtensions = true;

//     let user = req.body

//     if (req.body.password !== undefined)
//       req.body.password = await bcrypt.hash(
//         req.body.password,
//         12
//       );
//       console.log(req.body)
//       console.log('🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑')
//       console.log(user)

//     //we are not using catchAsync, therefore the 'err' parameter is there
//     //parsing so that the 'form' method is able to read it
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Photo could not be uploaded',
//         });
//       }
//       //save user
//       if (files.photo) {
//         user.photo.data = fs.readFileSync(
//           files.photo.path
//         );
//         user.photo.contentType = files.photo.type;
//       }
//       //
//     let user = req.body
//       //
//       // user.save((errs, result) => {
//       //   if (errs) {
//       //     return res.status(400).json({
//       //       error: errs,
//       //     });
//       //   }
//       //   res.status(200).json({
//       //     post: result,
//       //     message: 'success',
//       //   });
//       // });

//     });
//   }
// );

exports.deleteUser = catchAsync(
  async (req, res, next) => {
    const doc = await User.findByIdAndDelete(
      req.params.id
    );

    if (!doc) {
      res.status(404).json({
        error: 'No document found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Account has been deleted',
    });
  }
);
