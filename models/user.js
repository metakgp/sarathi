const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    fb_id: {
        type: String, 
        unique: true,
    },
    profile: String,
    token: String,
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
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    push_subscription: [String],
    profilePic: String,
    showProfileDialog: {
        type: Boolean,
        default: true,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;