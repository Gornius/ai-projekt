var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', requireAuthenticated, function(req, res, next) {
  res.render('index');
});

function requireAuthenticated(req, res, next) {
  if(!req.user) res.redirect('/users/login');
  else next();
};


module.exports = router;
