var express = require('express');
var {body, validationResult} = require('express-validator');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res) {
  res.render('register');
});

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
        });
      }
    })
  }
});

module.exports = router;
