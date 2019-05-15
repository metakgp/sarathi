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
