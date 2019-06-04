var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;
var passport = require('passport');
var webpush = require('web-push');
var axios = require('axios');
var fs = require('fs');

var utils = require('./util');

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
      groups = await disableRequestSentGroups(groups, req.query.fb_id);
      groups = disableJoinedOrCreatedGroups(groups, req.query.fb_id);

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

router.get('/create_group', (req, res) => {
  res.render('create_group.ejs');
});

// creates a group for the user
router.post('/create_group', (req, res) => {
  var traveler = {
    fb_id: req.body.fb_id,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: new Date(req.body.boardingTime),
  };
  var grp = models.Group({
    from: req.body.from,
    to: req.body.to,
    owner: traveler,
    members: [traveler],
    departure: req.body.departure,
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

router.get('/remove_group', (req, res) => {
  res.render('remove_group.ejs');
});

router.post('/remove_group', (req, res) => {
  models.Group.findByIdAndDelete(req.body.groupId, (err, group) => {
    
    // const message = {
    //   type: 'remove_group',
    //   title: 'Group removed',
    //   body: group.owner.name + ' has removed the group',
    // }

    // utils.createAndSendNotification(message, group, undefined, (err, notif) => {
    //   for (var i = 0; i < group.members.length; i++) {
    //     // send notif to each user and add notid if
    //     models.User.findOneAndUpdate({fb_id: group.members[i].fb_id}, {$push: {'notifications': notif}},
    //     {$pull: {'joined_groups': group._id}})
    //     .exec((err, user) => {
    //       if (err)
    //         res.send(err);
    //       else {
    //         webpush.sendNotification(JSON.parse(user.push_subscription), JSON.stringify(message))
    //         .catch(err => console.log(err));
    //       }
    //     });
    //   }
    // });

    res.send(200);
  });
});

router.post('/leave_group', (req, res) => {
  // find the user from the database
  models.User.findOneAndUpdate({fb_id: req.query.fb_id}, {$pull: {'joined_groups': req.body.groupId}})
  .exec((err, user) => {
     // find the group and remove that member
     models.Group.findByIdAndUpdate(req.body.groupId, {$pull: {'members': {'fb_id': req.query.fb_id}}}, {new: true})
     .exec((err, group) => {
       
        // create and send notifications to all the members
      //  const message = {
      //    type: 'leave_group',
      //    title: 'Left group',
      //    body: user.name + " has left the group",
      //  };

      //  utils.createAndSendNotification(message, group, undefined, (err, notif) => {
      //   for (var i = 0; i < group.members.length; i++) {
      //     // send notif to each user and add notid if
      //     models.User.findOne({fb_id: group.members[i].fb_id})
      //     .exec((err, user) => {
      //       if (err)
      //         res.send(err);
      //       else {
      //         webpush.sendNotification(JSON.parse(user.push_subscription), JSON.stringify(message))
      //         .catch(err => console.log(err));
      //       }
      //     });
      //   }
      // });

      res.send(200);
     });
  });
});

router.get('/group/:id', (req, res) => {
  models.Group.findById(req.params.id, (err, group) => {
    if (err)
      res.send(err)
    else
      res.send(group);
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

// send an authentication request to facebook OAuth
router.get('/auth/facebook', passport.authenticate("facebook"));

// This is the login redirect URI from the fb authentication server
// params - state-param : unique code to prevent csrf
// 
router.get('/auth/facebook/callback', passport.authenticate("facebook", {
  successRedirect: 'http://192.168.0.1:3000/',
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

router.get('/get_picture', (req, res) => {
  var file = fs.createWriteStream('./public/images/4567.jpg');
  axios.get('http://graph.facebook.com/2177672832321382/picture?type=square', {
    responseType: 'stream',
  })
  .then(response => {
    response.data.pipe(file);
    res.send("OK");
  })
  .catch(err => console.log(err));
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
    for (var j = 0; j < groups[i].members.length; j++) {
      if (groups[i].members[j].fb_id === userId)
        groups[i].status = 'joined';
    }
  }

  return groups;
}

module.exports = router;
