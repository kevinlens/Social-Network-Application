//(to parse form data, like file uploads/images)
const formidable = require('formidable');
//this stands for 'file system' its to read files and its built-in
const fs = require('fs');
//Pretty much a mongoose method that we configured to be reused
//Also this connects to the Database
const Post = require('../models/postModel');
const catchAsync = require('../utilities/catchAsync');

exports.getPosts = catchAsync(
  async (req, res, next) => {
    //the .select() removes that specific output item from the .find()
    const posts = await Post.find().select('-__v');
    res.status(200).json({
      posts,
    });
  }
);

exports.createPost = (req, res, next) => {
  /*-----------------------------------*/

  /*When you are using form data like this one you have to 
  go in Postman and use 'x-www-form-urlencoded' instead 'raw'*/
  //formidable package method that will give us form fields
  const form = new formidable.IncomingForm();

  /*tells the form to keep the file upload's in its format of jpeg,png,ect */
  form.keepExtensions = true;

  //parsing so that the 'form' method is able to read it
  form.parse(req, (fields, files) => {
    //create a new post from post model
    //pass in the users 'fields' to create a new post
    const post = new Post(fields);
    //gives the post's ownership to user who has userID
    post.postedBy = req.user;

    //if photo exist
    if (files.photo) {
      //this is will read the photo's file path and assign it
      post.photo.data = fs.readFileSync(
        files.photo.path
      );
      //assign it to the photo type like jpg or png
      post.photo.contentType = files.photos.type;
    }

    // save newly created post to database
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({
        post: result,
        message: 'success',
      });
    });
  });
};
