// DEVELOPMENT PRODUCTION: For developers
const sendErrorDev = (err, res) => {
  //pass in the error statusCode (e.g 404, 400, 200, ect)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//DUPLICATE USER INPUT ERROR
const handleDuplicateFieldsDB = (err, res) => {
  //Regular Expression: to find the users error causing email
  const value = err.errmsg.match(
    /(["'])(?:(?=(\\?))\2.)*?\1/
  )[0];
  const message = ` ${value} is already taken, please try another!`;
  // console.log(value);
  // console.log(message);
  res.status(400).json({
    error: message,
  });
};

//

//USER INPUT VALIDATION ERROR FOR FIELDS
const handleValidationErrorDB = (err, res) => {
  //turns object into an array using Object.value() to be able to use map(loop through it)
  //err.errors is an object of errors
  //for every error(element) in err.errors(now turned into an array), output the error message(element.message)
  /*Should in the end create an array from the converted object to something like this 
    [ 'Title must be between 4 to 150 characters',
      'Body must be between 4 to 2000 characters' ]
  */

  const errors = Object.values(err.errors).map(
    (element) => element.message
  );

  //const message = errors.join('. ');
  const message = errors;

  res.status(err.statusCode).json({
    error: message,
    data: err.errors.email.message,
    data2: err.errors,
  });
};

//

//UNDENTIFIED PRODUCTION ERROR FOR USER
const sendErrorProd = (err, res) => {
  //user friendly error to client, operational error like wrong routing ect
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
    });

    //for programmer, dont leak error detail to user
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    //2)Generic message
    res.status(500).json({
      status: 'error',
      error: 'Something went very wrong',
    });
  }
};

//

//

//

//

//

//This is the global error handler that is referred to from the app.js
//By default all errors go here
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //If we are in development then we need as much info as possible
  if (process.env.NODE_ENV === 'development') {
    //
    sendErrorDev(err, res);
    //
  } else if (process.env.NODE_ENV === 'production') {
    //if user input is a duplicate error(like email duplicate)
    if (err.code === 11000)
      err = handleDuplicateFieldsDB(err, res);
    //If its a user input validation error then....
    if (err.name === 'ValidationError') {
      handleValidationErrorDB(err, res);
    } else {
      sendErrorProd(err, res);
    }
    //
  }
};
