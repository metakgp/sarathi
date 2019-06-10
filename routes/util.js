var models = require('../models/index').models;
var webpush = require('web-push');

function createNotification(message, subject, object) {
  return new Promise((resolve, reject) => {
    const notif = models.Notification({
      type: message.type,
      message: message.body,
      subject: subject,
      object_id: object,
      created_on: Date.now(),
      is_read: false,
    });
  
    notif.save((err, notification) => {
      if (err)
        reject(err);
      else
        resolve(notification);
    });
  });
}

function sendNotification(push_subscription, message) {
  return webpush.sendNotification(JSON.parse(push_subscription), JSON.stringify(message));
}

const functions = {createNotification, sendNotification};

module.exports = functions;