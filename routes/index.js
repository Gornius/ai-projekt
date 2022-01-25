var express = require('express');
var router = express.Router();
var { requireAuthenticated, requireUnauthenticated } = require('./users');

/* GET home page. */
router.get('/', requireAuthenticated, function(req, res, next) {
  res.render('index');
});

module.exports.default = router;
