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

//If User Input Validation Error Occurs
const handleValidationErrorDB = (err, res) => {
  //turns object into an array using Object.value() and store it there
  const errors = Object.values(err.errors).map(
    (element) => element.message
  );

  const message = errors.join('. ');

  res.status(err.statusCode).json({
    error: message,
  });
};

//UNDENTIFIED PRODUCTION ERROR FOR USER
const sendErrorProd = (err, res) => {
  //user friendly error to client, operational error like wrong routing ect
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //for programmer, dont leak error detail to user
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    //2)Generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
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
    //If its a user input validation error then....
    if (err.name === 'ValidationError') {
      handleValidationErrorDB(err, res);
    } else {
      sendErrorProd(err, res);
    }
    //
  }
};
