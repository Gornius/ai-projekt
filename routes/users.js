var express = require('express');
var {body, validationResult} = require('express-validator');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Handle flash messages
router.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('/');
});

router.get('/register', requireUnauthenticated, function(req, res) {
  res.render('register');
});


// Setup registration
router.post('/register',
// Validation
body('name', 'Field required: name').notEmpty(),
body('username', 'Field required: username').notEmpty(),
body('password', 'Field required: password').notEmpty(),
body('email', 'Invalid email').isEmail(),
// End of validation
function(req, res) {
  var errors = validationResult(req).errors;
  console.log(errors);
  if (errors.length > 0) {
    console.log("validation errors");
    res.render('register', {errors: errors});
  }
  else {
    console.log("no validation errors adding user to database");
    var newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    User.getUserByUserName(newUser.name, (err, user) => {
      if(err) throw err;
      if (user) {
        req.flash('error_msg', 'User already exists');
        res.redirect('/users/register');
      }
      else {
        User.createUser(newUser, (err,user) => {
          if(err) throw err;
          console.log(user);
        });
        req.flash('success_msg', 'You are now registered! You can log in now!');
        res.redirect('/users/login')
      }
    })
  }
});

router.get('/login', requireUnauthenticated, (req, res) => {
  res.render('login');
});


// Setup login
function requireUnauthenticated(req, res, next) {
  if(req.user) res.redirect('/');
  else next();
}

function requireAuthenticated(req, res, next) {
  if(!req.user) res.redirect('/users/login');
  else next();
};

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUserName(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        console.log(`Login failed for user: ${username}. Reason: unknown user!`);
        return done(null, false, {message: 'Unknown user'});
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
        }
        else {
          console.log(`Login failed for user: ${username}. Reason: wrong password!`);
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out!');
  res.redirect('/users/login');
});

module.exports = {
  requireAuthenticated,
  requireAuthenticated,
  default: router,
}