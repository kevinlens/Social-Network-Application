const AppError = require('../utilities/appError');

// DEVELOPMENT PRODUCTION
const sendErrorDev = (err, res) => {
  //pass in the error statusCode (e.g 404, 400, 200, ect)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleValidationErrorDB = (err) => {
  //turns object into an array using Object.value() and store it there
  const errors = Object.values(err.errors).map(
    (element) => element.message
  );

  const message = `Invalid input data. ${errors.join(
    '. '
  )}`;

  return new AppError(message, 400);
};

//This is the global error handler that is referred to from the app.js
//By default all errors go here
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // if(process.env.NODE_ENV === 'development'){}
  if (err.name === 'ValidationError')
    err = handleValidationErrorDB(err);
  sendErrorDev(err, res);
};
