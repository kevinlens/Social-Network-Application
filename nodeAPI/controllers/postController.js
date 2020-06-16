//Pretty much a mongoose method that we configured to be reused
//Also this connects to the Database
const Post = require('../models/postModel');
const catchAsync = require('../utilities/catchAsync');

exports.getPosts = catchAsync(async (req, res) => {
  //the .select() removes that specific output item from the .find()
  const posts = await Post.find().select('-__v');
  res.status(200).json({
    posts,
  });
});

exports.createPost = catchAsync(async (req, res) => {
  //create a new post from post model
  const post = new Post(req.body);
  // save newly created post to database
  const result = await post.save();

  res.status(200).json({
    post: result,
  });
});
