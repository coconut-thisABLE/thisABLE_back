const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('./config/mongoose');
const indexRouter = require('./api/index');
const error = require('./api/middlewares/errors');
const passport = require('passport');
const strategies = require('./modules/passport');

require('dotenv').config();
mongoose.connect();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const {swaggerUi, specs} = require('./modules/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// passport
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);

// error handler
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
