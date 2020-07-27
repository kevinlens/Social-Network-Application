//(to parse form data, like file uploads/images)
const formidable = require('formidable');
//this stands for 'file system' its to read files and its built-in
const fs = require('fs');
//Pretty much a mongoose method that we configured to be reused
//Also this connects to the Database
const Post = require('../models/postModel');
const catchAsync = require('../utilities/catchAsync');

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

//

exports.getPosts = catchAsync(
  async (req, res, next) => {
    //the .select() removes that specific output item from the .find()
    //no need to add much here as it has already been done for us in the postModel
    const posts = await Post.find();
    res.status(200).json({
      posts,
    });
  }
);

exports.createPost = (req, res, next) => {
  /*When you are using form data like this one you have to 
  go in Postman and use 'x-www-form-urlencoded' instead 'raw'*/
  //formidable package method that will give us form fields
  // Conventionally people use this to upload files (like Images,Audios,etc )
  const form = new formidable.IncomingForm();

  /*tells the form to keep the file upload's in its format of jpeg,png,ect */
  form.keepExtensions = true;
  //

  //

  //
  //we are not using catchAsync, therefore the 'err' parameter is there
  //parsing so that the 'form' method is able to read it
  //the form will have fields[] and user inputted unique files
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload',
      });
    }

    //create a new post from post model
    //pass in the user's 'fields' like name, to create a new post called [field]
    const post = new Post(fields);
    //gives the post's ownership to user who has userID
    post.postedBy = req.user;

    //
    //if photo exist
    if (files.photo) {
      //this is will read the photo's file path and assign it
      post.photo.data = fs.readFileSync(
        files.photo.path
      );
      //assign it to the photo type like jpg or png
      post.photo.contentType = files.photos.type;
    }
    //

    // save newly created post to database
    post.save((errs, result) => {
      if (errs) {
        return res.status(400).json({
          error: errs,
        });
      }
      res.status(200).json({
        post: result,
        message: 'success',
      });
    });
    //
  });
};

//=========================================================

exports.getMyPosts = catchAsync(
  async (req, res, next) => {
    const posts = await Post.find({
      postedBy: req.params.id,
    });
    res.json({
      posts,
    });
  }
);

exports.updateMyPost = catchAsync(
  async (req, res, next) => {
    const filteredBody = filterObj(
      req.body,
      'title',
      'body'
    );
    //
    const user = filteredBody;
    user.updated_at = Date.now();

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      user,
      {
        //setting it as a "new" document
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      post: updatedPost,
    });
  }
);

exports.deleteMyPost = catchAsync(
  async (req, res, next) => {
    await Post.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    res.status(204).json({
      status: 'success',
      message: 'account has been removed!',
    });
  }
);

//=======================ADMIN==============================

exports.getUsersPost = catchAsync(
  async (req, res, next) => {
    // const posts = await Post.find({_id:req.params.id});
    const posts = await Post.findById(req.params.id);
    res.json({
      posts,
    });
  }
);

exports.updateUsersPost = catchAsync(
  async (req, res, next) => {
    const user = req.body;
    user.updated_at = Date.now();
    //
    const doc = await Post.findByIdAndUpdate(
      req.params.id,
      user,
      {
        //this states that the document is new
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      res.status(404).json({
        error: 'No document found with that ID',
      });
    }

    // doc.updated_at = Date.now();

    res.status(200).json({
      status: 'success',
      doc,
    });
  }
);

exports.deleteUsersPost = catchAsync(
  async (req, res, next) => {
    const doc = await Post.findByIdAndDelete(
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
