var express = require('express');
var {body, validationResult} = require('express-validator');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('/users/login');
});

router.get('/register', function(req, res) {
  res.render('register');
});


// Setup registration
router.post('/register',
// Validation
body('password', 'You need to enter password').notEmpty(),
body('email', 'You need to enter email').notEmpty(),
body('email', 'Invalid email format').isEmail(),
// End of validation
function(req, res) {
  var errors = validationResult(req).errors;
  console.log(errors);
  if (errors.length > 0) {
    console.log("validation errors");
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
        res.redirect('/users/register');
      }
      else {
        User.createUser(newUser, (err,user) => {
          if(err) throw err;
          console.log(user);
          res.redirect('/users/login')
        });
      }
    })
  }
});

router.get('/login', requireAuthenticated, (req, res) => {
  res.render('login');
});


// Setup login
function requireAuthenticated(req, res, next) {
  return next();
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


module.exports = router;
