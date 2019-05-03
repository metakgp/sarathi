const mongoose = require('mongoose');

const travelSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    from: String, 
    to: String,
    time: Date,
});

const Travel = mongoose.model('Travel', travelSchema);

module.exports = Travel;