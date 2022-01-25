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
    Note.default.find( { username: req.user.username } ,(err, docs) => {
        res.render('notes/list', { list: docs });
    });
});

router.get('/add', (req, res, next) => {
    res.render('notes/addOrEdit');
});

router.get('/edit/:id', (req, res, next) => {
    Note.default.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            if (req.user.name != doc.username)
            res.render('unauthorized');
            else
            res.render('notes/addOrEdit', {note: doc});
        }
    });
});

router.post('/add', (req, res, next) => {
    if(req.body._id == "") {
        Note.addNote(req.body.title, req.body.content, req.user.username, (err,doc) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('list');
            }
        });
    }
    else {
        Note.default.findById(req.body._id, (err, doc) => {
            if (req.user.username != doc.username) {
                res.render('unauthorized');
            }
            else {
                Note.default.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.redirect('list');
                    }
                });
            }
        });
    }
});


module.exports = {
    default: router
};