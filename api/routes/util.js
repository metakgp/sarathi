function createAndSendNotification(message, object, push_subscription, callback) {
    const notif = models.Notification({
      type: message.type,
      message: message.body,
      object_id: object,
      created_on: Date.now(),
      is_read: false,
    });
  
    notif.save((err, notification) => {
      if (err)
        res.send(err);
      else {
        if (push_subscription) {
          webpush.sendNotification(JSON.parse(push_subscription), JSON.stringify(message))
          .catch(err => console.log(err));
        }
        callback(err, notification);
      }
    });
  }

const functions = {createAndSendNotification};

module.exports = functions;