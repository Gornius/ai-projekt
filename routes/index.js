var express = require('express');
var router = express.Router();
var { requireAuthenticated, requireUnauthenticated } = require('./auth');

/* GET home page. */
router.get('/', requireAuthenticated, function(req, res, next) {
  res.redirect('/notes')
});

module.exports.default = router;
