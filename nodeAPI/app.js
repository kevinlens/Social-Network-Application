const express = require('express');
//
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//allow cross origin
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
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
with Json format data in Postman*/
//parse any incoming req.body to be readable and be updatable
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// Call upon Routes and Controllers
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//apiDocs
app.get('/api', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

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
