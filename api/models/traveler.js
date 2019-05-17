const mongoose = require('mongoose');

const travelerSchema = mongoose.Schema({
    fb_id: String,
    name: String,
    from: String, 
    to: String,
    date: Date,
    time: Date,
}, {_id: false});

module.exports = travelerSchema;