const mongoose = require('mongoose');

//This is a Mongoose method
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please write a title'],
    minlength: [
      4,
      'Title must be between 4 to 150 characters',
    ],
    maxlength: [
      150,
      'Title must be between 4 to 150 characters',
    ],
  },
  body: {
    type: String,
    required: [true, 'Please write a body'],
    minlength: [
      4,
      'Body must be between 4 to 2000 characters',
    ],
    maxlength: [
      2000,
      'Body must be between 4 to 2000 characters',
    ],
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
  active: {
    type: Boolean,
    default: true,
    /*Makes sure 'active' property is never outputted to user through 
    getAllUsers or getUsers*/
    select: false,
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

//

//MIDDLEWARE

//Before ANY 'find' query is invoke, eg.Tour.findById(), do this
postSchema.pre(/^find/, function (next) {
  //makes sure to populate the the embedded referenced data
  this.populate({
    path: 'postedBy',
    select: '-__v -created -role -email',
  });
  this.find({ active: true });
  //
  // const currentDate = new Date();
  // this.updated_at = currentDate.now;
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
//When you create a new post this will set up the timestamp
postSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

//

//

//The name we give it as first argument and schema as second argument
module.exports = mongoose.model('Post', postSchema);
