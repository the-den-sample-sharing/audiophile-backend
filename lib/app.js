const express = require('express');
const app = express();
// Routes and middleware
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const users = require('./controllers/users');
const profiles = require('./controllers/profiles');
const notFound = require('./middleware/not-found');
const error = require('./middleware/error');
const samples = require('./controllers/samples.js');
const bodyParser = require('body-parser');

// middleware

app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// App routes

app.use('/api/v1/users', users);
app.use('/api/v1/profiles', profiles);
app.use('/api/v1/samples', samples);

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFound);
app.use(error);

module.exports = app;
