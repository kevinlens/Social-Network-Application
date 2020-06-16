const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //removes spaces from username
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    //removes spaces from username
    trim: true,
    required: [true, 'Please provide us your email'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //Will only work on Create() and Save()
      //pass the property for this object and check if...
      validator: function (element) {
        return element === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  //randomly generated string
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

module.exports = mongoose.model('User', userSchema);
