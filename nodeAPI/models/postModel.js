const mongoose = require('mongoose');

//This is a Mongoose method
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: 4,
    maxlength: 150,
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    minlength: 4,
    maxlength: 2000,
  },
});

//The name we give it as first argument and schema as second argument
module.exports = mongoose.model('Post', postSchema);
