const mongoose = require('mongoose');
const travelerSchema = require('./traveler');

const requestSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    traveler: travelerSchema,
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;