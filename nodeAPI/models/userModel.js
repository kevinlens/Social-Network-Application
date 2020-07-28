const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  //To become admin you have to change it directly in the DB
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [
      8,
      'Password length must be 8 characters or more',
    ],
    /*Makes sure password is never outputted to user through 
    getAllUsers or getUsers, its a security feature*/
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
  passwordChangedAt: Date,
  //When account was made
  created: {
    type: Date,
    default: Date.now,
  },
  //When account info was updated
  updated: {
    type: Date,
    default: Date.now,
  },
  // photo: [{
  //   data: Buffer,
  //   contentType: String,
  // }],
  active: {
    type: Boolean,
    default: true,
    /*Makes sure 'active' property is never outputted to user through 
    getAllUsers or getUsers*/
    select: false,
  },
});
//

//

//

//PRE-SAVE

//its a perfect time to manipulate data through middleware, when data is sent before being entirely saved
//invoke this function 'pre' before, 'save' saving the data to the database
//
//ENCRYPT USER PASSWORD
/*Note: The reason why we don't use catchAsync for these middleware
is because is the catchAsync function is only meant for Express Route
Handlers and are not pointing to our Schema document to begin with*/
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

userSchema.pre(/^find/, function (next) {
  /*whether or not its find one or more users, only find 
  ones with 'active: true'*/
  this.find({ active: true });
  next();
});

//

//

//INSTANCE METHODS (could be used in all documents of a collection)

/*The 'correctPassword' Instance Method is created by you 
in the UserSchema to ready to be used anytime in your controller*/
/*Note: The reason why we don't use catchAsync for these middleware
is because is the catchAsync function is only meant for Express Route
Handlers and are not pointing to our Schema document to begin with*/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //
  /* We cannot compare the users password and users database
  password manually because one of them is encrypted, therefore
  you would need the bcrypt tool "bcrypt.compare()"*/
  return await bcrypt.compare(
    candidatePassword,
    userPassword
  );
  //
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp
) {
  //
  if (this.passwordChangedAt) {
    /* simple formula that turns the date into readable iat, 
    this is the initial data sent to the database */
    const changedTimestamp = parseInt(
      this.passwordChangedAt.timeTime() / 1000,
      10
    );
    //
    // console.log(changedTimestamp, JWTTimestamp);
    //Should return true or false
    return JWTTimestamp < changedTimestamp;
  }
  //false means password not changed
  return false;
  //
};

module.exports = mongoose.model('User', userSchema);
