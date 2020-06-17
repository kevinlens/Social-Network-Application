const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utilities/catchAsync');

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
    unique: [true, 'Email is already in use!'],
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [
      8,
      'Password length must be 8 characters or more',
    ],
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
  //When account was made
  created: {
    type: Date,
    default: Date.now,
  },
  //When account info was updated
  updated: Date,
});
//

//

//

//PRE-SAVE

//its a perfect time to manipulate data through middleware, when data is sent before being entirely saved
//invoke this function 'pre' before, 'save' saving the data to the database
//
//ENCRYPT USER PASSWORD
userSchema.pre('save', async function (next) {
  /*If password is not modified(empty password  string or not updated) then call next() middleware, else if it is
  modified(meaning a newly created document, with users password, or updated) 
  then encrypt the new password*/
  if (!this.isModified('password')) return next();
  //encrypt password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete password field
  //this works because the password is only a required INPUT not required data to be pushed to database
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model('User', userSchema);
