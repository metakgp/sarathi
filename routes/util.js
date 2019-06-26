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

function sendNotification(push_subscriptions, message) {
  var promiseArray = push_subscriptions.map(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(message));
  })
  
  return Promise.all(promiseArray);
}

const functions = {createNotification, sendNotification};

module.exports = functions;