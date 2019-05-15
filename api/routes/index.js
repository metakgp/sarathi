var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;
var passport = require('passport');
var webpush = require('web-push');

router.get('/', (req, res) => {
  models.Group.find({}, {__v: 0}).exec((err, objects) => {
    res.send(objects);
  });
});

// creates a group for the user
router.post('/create_group', (req, res) => {
  var traveler = {
    fb_id: req.body.fb_id,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
  };
  var grp = models.Group({
    from: req.body.from,
    to: req.body.to,
    owner: traveler,
    members: [traveler],
    departure: req.body.time,
    status: 'open',
  });
  grp.save((err, object) => {
    if (err)
      res.send(500, "error creating group");
    else {
      models.User.findOneAndUpdate({fb_id: traveler.fb_id}, {$push: {created_groups: object}})
      .exec((err, obj) => {
        res.send(200, "OK");
      }) ;
    }
  });
});

// sends a join request to the owner of the group
router.post('/join_request', (req, res) => {
  var traveler = {
    fb_id: req.body.fb_id,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
  };

  // find the group the user wants to join
  models.Group.findById(req.body.groupId).exec((err, group) => {
    var request = models.Request({
      group: group,
      traveler: traveler,
    });

    // create a request object
    request.save((err) => {
      if (err)
        res.send(500, "Error creating request");
      else {  
        // add those requests to the users concerned
        models.User.findOneAndUpdate({fb_id: req.body.fb_id}, {$push: {sent_requests: request}})
        .exec((err, user) => {
          if (err) {
            res.send(500, "Error adding sent request to user");
          }

          models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$push: {received_requests: request}})
          .exec((err, owner) => {
            if (err)
              res.send(500, "Error adding received request to user");
            else {

              // send notication to this user (the owner of the group)
              const message = {
                type: 'join_request',
                title: 'Join Request',
                body: user.name + " has sent a join request",
              }
              webpush.sendNotification(JSON.parse(owner.push_subscription), JSON.stringify(message))
              .catch(err => console.log(err))
              .then(() => res.send(200, "OK"));
            }
          });
        });
      }
    });
  });
});

// approves a request to join the group
//TODO: update notification and send it to all members
router.post('/approve_request', (req, res) => {
  var traveler = {
    fb_id: req.body.fb_id,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
  };
  models.Group.findByIdAndUpdate(req.body.groupId, {$push: {members: traveler}})
  .exec((err, object) => {
    if (err)
      res.send(500, err);
    else {
      // remove request from sent_request of user
      models.User.findOneAndUpdate({name: req.body.fb_id}, 
        {$pull: {sent_requests: req.body.requestId}, $push: {joined_groups: object}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
        });
      
      // remove request from recieved_request from group owner
      models.User.findOneAndUpdate({name: object.owner.fb_id}, 
        {$pull: {received_requests: req.body.requestId}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
          else
            res.send(200, "OK");
        });
    }
  });
});

// rejects a request to join the group
//TODO: update notification and send it to all members
router.post('/reject_request', (req, res) => {
  models.Group.findById(req.body.groupId)
  .exec((err, object) => {
    if (err)
      res.send(500, err);
    else {
      // remove request from sent_request of user
      models.User.findOneAndUpdate({name: req.body.fb_id}, 
        {$pull: {sent_requests: req.body.requestId}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
        });
      
      // remove request from recieved_request from group owner
      models.User.findOneAndUpdate({name: object.owner.fb_id}, 
        {$pull: {received_requests: req.body.requestId}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
          else
            res.send(200, "OK");
        });
    }
  });
});

router.post('/search', (req, res) => {
  res.redirect(301, url.format({
    pathname: '/',
    query: req.body,
  }));
});

// send an authentication request to facebook OAuth
router.get('/auth/facebook', passport.authenticate("facebook"));

// This is the login redirect URI from the fb authentication server
// params - state-param : unique code to prevent csrf
// 
router.get('/auth/facebook/callback', passport.authenticate("facebook", {
  successRedirect: '/',
  failureRedirect: '/logout',
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.send(200, "OK");
});

router.get('/login', (req, res) => {
  res.render('login.ejs', {user: req.user});
});

// test route for service worker registration
router.get('/test', (req, res) => {
  res.render('index.ejs');
});

// Test route for push messages
router.post('/test2', (req, res) => {
  const pushSubscription = JSON.parse(req.user.push_subscription);
  const message = JSON.stringify({title: 'Notification', body: 'Hey! Arib'});
  webpush.sendNotification(pushSubscription, message).catch(err => console.log(err))
  .then(() => res.sendStatus(200));
});

router.post('/subscribe', (req, res) => {
  const pushSubscription = JSON.stringify(req.body);
  models.User.findByIdAndUpdate(req.user.id, {push_subscription: pushSubscription})
  .exec((err) => {
    if (err) {
      res.send(500, "Error updating user object for storing push subscription");
    }
    res.sendStatus(200);
  });
});

module.exports = router;
