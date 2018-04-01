var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config();
var mysql = require('mysql');


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let catRouter = require('./routes/cat');
let catsRouter = require('./routes/cats');

let mysqlConnection = mysql.createConnection({
  host: process.env.CATS_HOST,
  user: process.env.CATS_USER,
  password: process.env.CATS_PASSWORD,
  database: process.env.CATS_DATABASE,
  ssl: "Amazon RDS"
});

mysqlConnection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + mysqlConnection.threadId);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cat', catRouter);
app.use('/cats', catsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
