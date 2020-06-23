const express = require('express');
//
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const globalErrorHandler = require('./controllers/errorController');
//enable .env file configuration
dotenv.config();

// Connect to Database
// Also used to get rid of some deprecation warnings
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
  });
mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`);
});

//

//

//

//

// Brings in Routes
const postRoutes = require('./routes/postRoute');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
//Whenever you do app.use, the 'use' tells you that its a middleware
// Middleware that outputs time it took to complete task
app.use(morgan('dev'));
/*These body parser setup are essential for you, especially if you are 
going to be using Postman to update, create, and get data. It's to work
with form-data and Json format data in Postman*/
//parse any incoming req.body to be readable and be updatable
app.use(bodyParser.json());
app.use(cookieParser());
/*These body parser setup are essential for you, especially if you are 
going to be using Postman to update, create, and get data. It's to work
with form-data and Json format data in Postman*/
//parse any incoming req.body to be readable and be updatable
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Call upon Routes and Controllers
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

//

//

//

//

/*Global Error Handler for all the failed and rejected 
CatchAsync() promises that were passed down and all other types of errors*/
/*Note: The reason why we don't use catchAsync for some middleware
is because is the catchAsync function is only meant for Express Route
Handlers and are not pointing to our Schema document to begin with*/
app.use(globalErrorHandler);

//

const port = process.env.PORT || 8080;
//listens to see if user is on 8080 http server and send nodejs to browser
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
