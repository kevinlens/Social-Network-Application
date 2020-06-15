const express = require('express');
//
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
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

//Whenever you do app.use, the 'use' tells you that its a middleware
// Middleware that outputs time it took to complete task
app.use(morgan('dev'));
//parse any incoming req.body to be readable
app.use(bodyParser.json());
// Call upon Routes and Controllers
app.use('/', postRoutes);
//

//

//

//

//Global Error Handler for all the failed CatchAsync() promises that were passed down
app.use(globalErrorHandler);

//

const port = process.env.PORT || 8080;
//listens to see if user is on 8080 http server and send nodejs to browser
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
