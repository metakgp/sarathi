const mongoose = require('mongoose');

const travelerSchema = mongoose.Schema({
    name: String,
    from: String, 
    to: String,
    time: Date,
}, {_id: false});

module.exports = travelerSchema;