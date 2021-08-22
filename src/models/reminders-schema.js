const mongoose = require('mongoose');

const remindersSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const name = 'reminders';

module.exports = mongoose.model[name] || mongoose.model(name, remindersSchema);