var express = require('express');
var { body, validationResult } = require('express-validator');
var router = express.Router();
var { requireAuthenticated } = require('./auth');

var Note = require('../models/note');

//@TODO: Handle flash messages


//Require authentication to access whole module
router.use(requireAuthenticated);

// Redirect default route to list view
router.get('/', (req, res, next) => {
    res.redirect('/notes/list');
});

router.get('/list', (req, res, next) => {
    res.render('notes/list')
});


module.exports = {
    default: router
};