var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars').engine;
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var connectFlash = require('connect-flash');
var passport = require('passport');
var dotenv = require('dotenv');

// configure dotenv
dotenv.config();

// connect to db
mongoose.connect('mongodb://127.0.0.1/checkyns').then(console.log("Connected to databse"));

// routers
var indexRouter = require('./routes/index').default;
var authRouter = require('./routes/auth').default;
var noteRouter = require('./routes/notes').default;

var app = express();

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

// Logger
app.use(logger('dev'));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static dir
app.use(express.static(path.join(__dirname, 'public')));

// Express session init
app.use(expressSession({
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: true,
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(connectFlash());

// Define global variables
app.use((req, res, next) => {
  app.locals.siteTitle = 'Checkyns';
  if (req.user) {
    res.locals.username = req.user.name;
  }
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/notes', noteRouter);

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
