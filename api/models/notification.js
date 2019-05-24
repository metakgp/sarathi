const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    type: String,
    message: String,
    object_id: mongoose.Schema.Types.ObjectId,
    created_on: Date, 
});

const notification = mongoose.model('Notification', notificationSchema);

module.exports = notification;