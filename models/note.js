var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
    title: {
        type: String
    },
    date: {
        type: Date
    },
    content: {
        type: String
    },
    username: {
        type: String
    }
});

var Note = module.exports = mongoose.model('Note', noteSchema);
