const express = require('express');
const path = require('path');
const dotenv  = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require("./middleware/error");
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const hpp = require('hpp');

const mongoSanitize = require("express-mongo-sanitize");

const fileupload = require('express-fileupload');


//Load env variables

dotenv.config({ path:'./config/config.env'});

connectDB();


// Route files
const bootcamps = require('./routes/bootCamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');




const app = express();

// Body parser
app.use(express.json());


app.use(cookieParser());

if(process.env.NODE_ENV=== 'development'){
    app.use(morgan('tiny'))
}


// File uploading
app.use(fileupload());


// it will make sure NoSQL inject attack doesnt happen
app.use(mongoSanitize());

// Add security header
app.use(helmet());


// Prevent XSS attack
app.use(xss());


// Limit the number of request/ time

app.use(rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 100
}))


// Prevent http param pollution

app.use(hpp());




// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.use(function(req, res, next) {
    console.log('test');
    res.status(404).send("custom not found handler called");
  });

const server = app.listen(PORT, () => {
    console.log(`App listening in ${process.env.NODE_ENV} mode on ${PORT} !`.yellow.bold);
});

//Handle unhandled promise reject

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error : ${err.message}`)
    server.close(() => process.exit(1))
});