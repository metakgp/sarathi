const mongoose = require('mongoose');
const travelerSchema = require('./traveler');

const groupSchema = mongoose.Schema({
    from: String,
    to: String,
    owner: travelerSchema,
    members: [travelerSchema],
    departure: Date,
    status: String,
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;