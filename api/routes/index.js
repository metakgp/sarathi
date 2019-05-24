var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;
var passport = require('passport');
var webpush = require('web-push');

router.get('/', (req, res) => {
  models.Group.aggregate([
    {$match: {'from': req.query.from, 'to': req.query.to }},
    {$addFields: {
      'duration': {$abs: {$subtract: ['$departure', new Date(req.query.time)]}},
    }},
    {$match: {'duration': {$lte: 86400000}}},
    {$sort: {'duration': 1}},
  ]).exec((err, groups) => {
    if (err)
      res.send(err);
    else {
      // given sorted results, we need to paginate the data
      var result = [];
      var batchSize = 1;

      // get the last element from the previous page
      if (req.query.after) {
        for (var i = 0; i < groups.length; i++) {
          if (groups[i]._id.toString() === req.query.after) {
            result = groups.slice(i+1, i + batchSize + 1);
            break;
          }
        }
      }
      else
        result = groups.slice(0, batchSize);

      const page_details = {
        base: '/',
      };

      // add next key for paging
      if (result.length) {
        page_details.next = url.format({
          pathname: '/',
          query: Object.assign(req.query, {after: result[result.length - 1]._id.toString()}),
        });
      }

      res.send({paging: page_details, data: result});
    }
  });
});

router.get('/create_group', (req, res) => {
  res.render('create_group.ejs');
});

// creates a group for the user
router.post('/create_group', (req, res) => {
  console.log(req.body);
  var traveler = {
    fb_id: req.body.fb_id,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: new Date(req.body.time),
    // time: Date.now(),
  };
  var grp = models.Group({
    from: req.body.from,
    to: req.body.to,
    owner: traveler,
    members: [traveler],
    departure: traveler.time,
    status: 'open',
  });
  grp.save((err, object) => {
    if (err)
      res.send(500, err);
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
    if (err)
      res.send(500, "Error updating user object for storing push subscription");
    else
      res.sendStatus(200);
  });
});

module.exports = router;
