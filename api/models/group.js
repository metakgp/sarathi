const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    from: String,
    to: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel'   
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel'
    }],
    departure: Date,
    status: String,
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;