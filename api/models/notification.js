const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    type: String,
    message: String,
    subject: {
        fb_id: String,
        name: String,
    }
    object_id: mongoose.Schema.Types.ObjectId,
    created_on: Date, 
    read: Boolean,
});

const notification = mongoose.model('Notification', notificationSchema);

module.exports = notification;