// To send user friendly errors if they failed to fill out required fields
//Note: npm i express-validator is a global validator which does not need an import besides from app.js
exports.createPostValidator = (req, res, next) => {
  //request 'title' cannot be empty else give custom error message
  req.check('title', 'Write a title').notEmpty();
  //title has to be specific length else output custom error message
  req
    .check(
      'title',
      'Title must be between 4 to 150 characters'
    )
    .isLength({ min: 4, max: 150 });
  // body
  req.check('body', 'Write a body').notEmpty();
  req
    .check(
      'body',
      'Body must be between 4 to 2000 characters'
    )
    .isLength({ min: 4, max: 2000 });

  //Check for errors

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(
      (error) => error.msg
    )[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  next();
};
