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

var Note = mongoose.model('Note', noteSchema);

function addNote(title, content, username, callback) {
    var note = new Note({
        title: title,
        content: content,
        date: Date(),
        username: username
    });
    note.save(callback);
}

module.exports = {
    default: Note,
    addNote,
};
