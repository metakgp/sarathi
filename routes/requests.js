const express = require('express');
const router = express.Router();
const models = require('../models/index').models;
const webpush = require('web-push');
const utils = require('./util');

router.get('/join_request', (req, res) => {
  res.render('join_request.ejs');
});

router.post('/join_request', async (req, res) => {

  try {
    var traveler = {
      fb_id: req.user.fb_id,
      profile: req.user.profile,
      name: req.user.name,
      from: req.body.from,
      to: req.body.to,
      time: new Date(req.body.time),
    };

    var group = await models.Group.findById(req.body.groupId).exec();

    // create a request object
    var requestModel = models.Request({
      group: group,
      traveler: traveler,
    });

    var request = await requestModel.save();

    // add those requests to the users concerned
    var promiseArray = [];
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$push: {received_requests: request}}).exec()
    );
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: traveler.fb_id}, {$push: {sent_requests: request}}).exec()
    );

    var [owner, traveler] = await Promise.all(promiseArray);

    const message = {
      icon: 'http://graph.facebook.com/' + traveler.fb_id + '/picture?type=square',
      type: 'join_request',
      title: 'Join Request',
      body: traveler.name + " has requested to join your group",
    };
    
    await utils.sendNotification(owner.push_subscription, message)
    res.sendStatus(200)
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});


router.get('/approve_request', (req, res) => {
  res.render('approve_request.ejs');
});
  
router.post('/approve_request', async (req, res) => {

  try {

    var request = await models.Request.findById(req.body.requestId).exec();
    var group = await models.Group.findByIdAndUpdate(request.group, {$push: {members: request.traveler}}).exec();

    var promiseArray = [];
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$pull: {received_requests: req.body.requestId}}).exec()
    );
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, 
        {$pull: {sent_requests: req.body.requestId}, $push: {joined_groups: group}}).exec()
    );

    var [owner, traveler] = await Promise.all(promiseArray);

    // message to all the members of the group
    const messageToMembers = {
      icon: 'http://graph.facebook.com/' + traveler.fb_id + '/picture?type=square',
      type: 'approve_request',
      title: 'Group Update',
      body: traveler.name + " has joined the group",
    };

    const subjectToMembers = {
      fb_id: traveler.fb_id,
      name: traveler.name,
    }
    
    promiseArray = group.members.map(item => 

      utils.createNotification(messageToMembers, subjectToMembers, group)
      .then(notification => models.User.findOneAndUpdate({fb_id: item.fb_id}, {$push: {'notifications': notification}}).exec())
      .then(user => utils.sendNotification(user.push_subscription, messageToMembers))
    
    );

    // message to the traveler
    const messageToTraveler = {
      icon: 'http://graph.facebook.com/' + owner.fb_id + '/picture?type=square',
      type: 'approve_request',
      title: 'Request Update',
      body: owner.name + " has approved your request to join the group",
    };

    const subjectToTraveler = {
      fb_id: owner.fb_id,
      name: owner.name,
    }

    var promiseArray = [];
    promiseArray.push(
      
      utils.createNotification(messageToTraveler, subjectToTraveler, group)
      .then(notification => models.User.findOneAndUpdate({fb_id: traveler.fb_id}, {$push: {'notifications': notification}}).exec())
      .then(user => utils.sendNotification(user.push_subscription, messageToTraveler)) 
    
    );

    await Promise.all(promiseArray);
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.get('/reject_request', (req, res) => {
  res.render('approve_request.ejs');
});


router.post('/reject_request', async (req, res) => {

  try {
    var request = await models.Request.findById(req.body.requestId).exec();
    var group = await models.Group.findById(request.group).exec();

    var promiseArray = [];
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$pull: {received_requests: req.body.requestId}}).exec()
    )
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, {$pull: {sent_requests: req.body.requestId}}).exec()
    )

    var [owner, traveler] = await Promise.all(promiseArray);

    // message to the traveler
    const message = {
        icon: 'http://graph.facebook.com/' + owner.fb_id + '/picture?type=square',
        type: 'approve_request',
        title: 'Request Update',
        body: owner.name + " has rejected your request to join the group",
    };

    const subject = {
      fb_id: owner.fb_id,
      name: owner.name,
    }

    await utils.createNotification(message, subject, group)
    .then(notification => models.User.findOneAndUpdate({fb_id: traveler.fb_id}, {$push: {'notifications': notification}}).exec())
    .then(user => utils.sendNotification(user.push_subscription, message))
    
    res.sendStatus(200)

  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.post('/cancel_request', async (req, res) => {

  try {
    var request = await models.Request.findById(req.body.requestId).exec();
    var group = await models.Group.findById(request.group).exec();

    var promiseArray = [];
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$pull: {received_requests: req.body.requestId}}) 
    );
    promiseArray.push(
      models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, {$pull: {sent_requests: req.body.requestId}})
    )

    await Promise.all(promiseArray);
    res.sendStatus(200);
    
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

});


module.exports = router;