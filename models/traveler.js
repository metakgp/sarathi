const mongoose = require('mongoose');

const travelerSchema = mongoose.Schema({
    fb_id: String,
    profile: String,
    name: String,
    from: String, 
    to: String,
    time: Date,
}, {_id: false});

module.exports = travelerSchema;