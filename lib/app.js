const express = require('express');
const app = express();
// Routes and middleware
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const studios = require('./routes/studios');
const notFound = require('./middleware/not-found');
const error = require('./middleware/error');

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// App routes
app.use('/api/v1/users', users);
app.use('/api/v1/studios', studios);

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFound);
app.use(error);

module.exports = app;
