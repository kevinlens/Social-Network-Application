//Pretty much a mongoose method that we configured to be reused
const Post = require('../models/postModel');
const catchAsync = require('../utilility/catchAsync');

exports.getPosts = (req, res) => {
  res.json({
    posts: [
      {
        title: 'First post',
      },
      {
        title: 'Second post',
      },
    ],
  });
};

exports.createPost = catchAsync(async (req, res) => {
  //create a new post from post model
  const post = new Post(req.body);
  // save newly created post to database
  const result = await post.save();

  res.status(200).json({
    post: result,
  });
});
