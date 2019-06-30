var express = require('express');
var router = express.Router();
var models = require('../models/index').models;
var passport = require('passport');
var webpush = require('web-push');
var utils  = require('./util');

router.get('/:id', (req, res) => {
  models.Group.findById(req.params.id).exec()
  .then(group => res.status(200).send(group))
  .catch(err => res.status(500).send(err));
});

router.get('/create_group', (req, res) => {
  res.render('create_group.ejs');
});

// creates a group for the user
router.post('/create_group', async (req, res) => {
  
  var traveler = {
    fb_id: req.user.fb_id,
    profile: req.user.profile,
    name: req.user.name,
    from: req.body.from,
    to: req.body.to,
    time: new Date(req.body.boardingTime),
  };
  var grp = models.Group({
    from: traveler.from,
    to: traveler.to,
    owner: traveler,
    departure: req.body.departure,
    status: 'open',
  });

  grp.save()
  .then(group => models.User.findOneAndUpdate({fb_id: traveler.fb_id}, {$push: {created_groups: group}}).exec())
  .then(() => res.sendStatus(200))
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  })

});

router.get('/remove_group', (req, res) => {
  res.render('remove_group.ejs');
});

router.post('/remove_group', async (req, res) => {

  try {
    var group = await models.Group.findByIdAndDelete(req.body.groupId).exec();
    var owner = await models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$pull: {'created_groups': group._id}}).exec();

    const message = {
      icon: 'https://graph.facebook.com/' + owner.fb_id + '/picture?type=square',
      type: 'remove_group',
      title: 'Group removed',
      body: owner.name + ' has removed the group',
      data: {
        urlToOpen: '/notifs'
      }
    }

    const subject = {
      fb_id: owner.fb_id,
      name: owner.name,
    }

    var promiseArray = group.members.map(item => {
      
      utils.createNotification(message, subject, group)
      .then(notification =>
        models.User.findOneAndUpdate({fb_id: item.fb_id},
          { 
            $push: {'notifications': notification},
            $pull: {'joined_groups': group._id}
          })
        .exec())
      .then(user => utils.sendNotification(user.push_subscription, message));

    });

    await Promise.all(promiseArray);
    res.sendStatus(200);

  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.post('/leave_group', async (req, res) => {

  try {
    var user = await models.User.findOneAndUpdate({fb_id: req.user.fb_id}, {$pull: {'joined_groups': req.body.groupId}}).exec();
    var group = await models.Group.findByIdAndUpdate(req.body.groupId, {$pull: {'members': {'fb_id': req.user.fb_id}}}, {new: true}).exec();

    const message = {
      icon: 'https://graph.facebook.com/' + user.fb_id + '/picture?type=square',
      type: 'leave_group',
      title: 'Left group',
      body: user.name + " has left the group",
      data: {
        urlToOpen: '/notifs'
      }
    };

    const subject = {
      fb_id: user.fb_id,
      name: user.name,
    };

    var promiseArray = group.members.map(item =>
      utils.createNotification(message, subject, group)
      .then(notification =>
        models.User.findOneAndUpdate({fb_id: item.fb_id},
        {$push: {'notifications': notification}})
        .exec())
      .then(user => utils.sendNotification(user.push_subscription, message))
    );

    promiseArray.push(
      utils.createNotification(message, subject, group)
      .then(notification =>
        models.User.findOneAndUpdate({fb_id: group.owner.fb_id},
        {$push: {'notifications': notification}})
        .exec())
      .then(user => utils.sendNotification(user.push_subscription, message))
    );

    await Promise.all(promiseArray);
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.post('/toggle_status', async (req, res) => {

  try {

    if (req.body.status == 'open')
      var newStatus = 'closed';
    else
      var newStatus = 'open';

    var group = await models.Group.findByIdAndUpdate(req.body.groupId, {status: newStatus}).exec();

    const message = {
      icon: 'https://graph.facebook.com/' + group.owner.fb_id + '/picture?type=square',
      type: 'toggle_status',
      title: 'Status changed',
      body: group.owner.name + " has " + (newStatus === 'open'? 'reopened' : 'closed') + " the group",
      data: {
        urlToOpen: '/notifs'
      }
    };


    const subject = {
      fb_id: group.owner.fb_id,
      name: group.owner.name,
    };

    var promiseArray = group.members.map(item =>
      utils.createNotification(message, subject, group)
      .then(notification =>
        models.User.findOneAndUpdate({fb_id: item.fb_id},
        {$push: {'notifications': notification}})
        .exec())
      .then(user => utils.sendNotification(user.push_subscription, message))
    );

    await Promise.all(promiseArray);
    res.status(200).send(newStatus);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});


router.get('/change_time', (req, res) => {
    res.render('change_time.ejs');
});
  
router.post('/change_time', async (req, res) => {
    
  try {
    var group = await models.Group.findByIdAndUpdate(req.body.groupId, {departure: new Date(req.body.departure)}).exec();
    const message = {
      icon: 'https://graph.facebook.com/' + group.owner.fb_id + '/picture?type=square',
      type: 'change_time',
      title: 'Time change',
      body: group.owner.name + ' has changed the departure time',
      data: {
        urlToOpen: '/notifs'
      }
    };

    const subject = {
      fb_id: group.owner.fb_id,
      name: group.owner.name,
    }

    var promiseArray = group.members.map(item =>
      utils.createNotification(message, subject, group)
      .then(notification =>
        models.User.findOneAndUpdate({fb_id: item.fb_id},
        {$push: {'notifications': notification}})
        .exec())
      .then(user => utils.sendNotification(user.push_subscription, message))
    );

    await Promise.all(promiseArray);
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});

module.exports = router;
  
