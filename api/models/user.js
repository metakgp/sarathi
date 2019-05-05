const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    created_groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    joined_groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    sent_requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
    }],
    received_requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;