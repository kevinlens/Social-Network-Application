const mongoose = require('mongoose');

//This is a Mongoose method
const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  photo: {
    type: Buffer,
    contentType: String,
  },
  postedBy: {
    //special referencing command
    //This expects the 'type' to be a MongoDB document object Id (basically userId)
    type: mongoose.Schema.ObjectId,
    //referencing the userModel, the name e.g "const User = mongoose.model('User', userSchema);" of the User Schema Model
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

//The name we give it as first argument and schema as second argument
module.exports = mongoose.model('Post', postSchema);
