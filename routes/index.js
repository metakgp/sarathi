var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;
var passport = require('passport');
var webpush = require('web-push');
var axios = require('axios');
var fs = require('fs');
var path = require('path');

var utils = require('./util');

// router.use((req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

router.get('/', async (req, res) => {
  models.Group.aggregate([
    {$match: {'from': req.query.from, 'to': req.query.to }},
    {$addFields: {
      'duration': {$abs: {$subtract: ['$departure', new Date(req.query.time)]}},
    }},
    {$match: {'duration': {$lte: 86400000}}},
    {$sort: {'duration': 1}},
  ]).exec(async (err, groups) => {
    if (err)
      res.send(err);
    else {

      // remove groups that should be in disable form
      // 1. user is sent a join request
      // 2. user is a member already
      // 3. group is closed
      groups = await disableRequestSentGroups(groups, req.user.fb_id);
      groups = disableJoinedOrCreatedGroups(groups, req.user.fb_id);

      // given sorted results, we need to paginate the data
      var result = [];
      var batchSize = 10;

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


router.post('/notification/read_notif', (req, res) => {
  models.Notification.findByIdAndUpdate(req.body.notifId, {read: true})
  .exec((err, notif) => {
    if (err)
      res.send(err);
    else
      res.send(200);
  });
});

router.post('/unsubscribe', (req, res) => {
  const pushSubscription = JSON.stringify(req.body);
  models.User.findOneAndUpdate({fb_id: req.user.fb_id}, {$pull: {push_subscription: pushSubscription}}).exec()
  .then(() => res.send(200))
  .catch(() => {
    console.log(err);
    res.status(500).send(err);
  }); 
});

router.post('/subscribe', (req, res) => {
  const pushSubscription = JSON.stringify(req.body);
  models.User.findOneAndUpdate({fb_id: req.user.fb_id}, {$push: {push_subscription: pushSubscription}})
  .exec((err) => {
    if (err) {
      console.log(err);
      res.send(500, err);
    }
    else
      res.sendStatus(200);
  });
});

async function disableRequestSentGroups(groups, userId) {
  try {
    user = await models.User.findOne({fb_id: userId}).populate('sent_requests');
    // getting group ids from all sent requests
    sentRequestGroups = user.sent_requests.map(item => item.group.toString());
    for (var i = 0; i < groups.length; i++) {
      if (sentRequestGroups.includes(groups[i]._id.toString()))
        groups[i].status = 'request_sent';
    }

    return groups;
  }
  catch(err) {
    console.log(err);
    return groups;
  }
}

function disableJoinedOrCreatedGroups(groups, userId) {
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].owner.fb_id === userId) {
      groups[i].status = 'joined';
      continue;
    }
    for (var j = 0; j < groups[i].members.length; j++) {
      if (groups[i].members[j].fb_id === userId) {
        groups[i].status = 'joined';
        break;
      }
    }
  }

  return groups;
}

module.exports = router;
