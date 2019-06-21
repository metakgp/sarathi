const express = require('express');
const router = express.Router();
const models = require('../models/index').models;
const webpush = require('web-push');
const utils = require('./util');

router.get('/join_request', (req, res) => {
  res.render('join_request.ejs');
});

// sends a join request to the owner of the group
router.post('/join_request', (req, res) => {
    var traveler = {
      fb_id: req.query.fb_id,
      profile: req.query.profile,
      name: req.query.name,
      from: req.body.from,
      to: req.body.to,
      time: new Date(req.body.time),
    };
  
    // find the group the user wants to join
    models.Group.findById(req.body.groupId).exec((err, group) => {
      if (err)
        res.send(500, err);

      var request = models.Request({
        group: group,
        traveler: traveler,
      });
  
      // create a request object
      request.save((err) => {
        if (err)
          res.send(500, err);
        else {  
          // add those requests to the users concerned
          models.User.findOneAndUpdate({fb_id: req.query.fb_id}, {$push: {sent_requests: request}})
          .exec((err, user) => {
            if (err) {
              res.send(500, err);
            }
  
            models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, {$push: {received_requests: request}})
            .exec((err, owner) => {
              if (err)
                res.send(500, err);
              else {
  
                // send request notication to this user (the owner of the group)
                const message = {
                  icon: 'http://graph.facebook.com/' + user.fb_id + '/picture?type=square',
                  type: 'join_request',
                  title: 'Join Request',
                  body: user.name + " has sent a join request",
                };
                
                utils.sendNotification(owner.push_subscription, message)
                .then(() => res.send(200)).catch(err => {console.log(err); res.send(err)});
              }
            });
          });
        }
      });
    });
});

router.get('/approve_request', (req, res) => {
  res.render('approve_request.ejs');
});
  
  // approves a request to join the group
  //TODO: update notification and send it to all members
router.post('/approve_request', (req, res) => {
    // find the request object
    models.Request.findById(req.body.requestId, (err, request) => {
      if (err)
        res.send(500, err);
      else {
        // find the group and add the travler
        models.Group.findByIdAndUpdate(request.group, {$push: {members: request.traveler}})
        .exec((err, group) => {
          if (err)
            res.send(500, err);
          else {
            // remove received request from owner of the group
            models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, 
              {$pull: {received_requests: req.body.requestId}})  //remove requests matching req id
              .exec((err) => {
                if (err)
                  res.send(500, err);
                else {
                  // remove request from sent_request of traveler
                  models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, 
                    {$pull: {sent_requests: req.body.requestId}, $push: {joined_groups: group}})  //remove requests matching req id
                    .exec((err, traveler) => {
                      if (err)
                        res.send(500, err);
                      else {
                        
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
                        
                        var promiseArray = group.members.map(item => {
                          utils.createNotification(messageToMembers, subjectToMembers, group)
                          .then(notification =>
                            models.User.findOneAndUpdate({fb_id: item.fb_id},
                            {$push: {'notifications': notification}})
                            .exec())
                          .then(user => utils.sendNotification(user.push_subscription, messageToMembers));
                        });

                        // message to the traveler
                        const messageToTraveler = {
                          icon: 'http://graph.facebook.com/' + group.owner.fb_id + '/picture?type=square',
                          type: 'approve_request',
                          title: 'Request Update',
                          body: group.owner.name + " has approved your request",
                        };

                        const subjectToTraveler = {
                          fb_id: group.owner.fb_id,
                          name: group.owner.name,
                        }

                        promiseArray.push(utils.createNotification(messageToTraveler, subjectToTraveler, group)
                        .then(notification =>
                          models.User.findOneAndUpdate({fb_id: traveler.fb_id},
                          {$push: {'notifications': notification}})
                          .exec())
                        .then(user => utils.sendNotification(user.push_subscription, messageToTraveler)));
                
                        Promise.all(promiseArray).then(values => res.send(200)).catch(err => {
                          console.log(err);
                          res.status(500).send(err);
                        });

                      }
                  });
                }
            });
          }
        });
      }
    });
});

router.get('/reject_request', (req, res) => {
  res.render('approve_request.ejs');
});

// rejects a request to join the group
//TODO: update notification and send it to all members
router.post('/reject_request', (req, res) => {
    // find the request object
    models.Request.findById(req.body.requestId, (err, request) => {
        if (err)
        res.send(500, err);
        else {
        // find the group
        models.Group.findById(request.group)
        .exec((err, group) => {
            if (err)
            res.send(500, err);
            else {
            // remove received request from owner of the group
            models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, 
                {$pull: {received_requests: req.body.requestId}})  //remove requests matching req id
                .exec((err) => {
                if (err)
                  res.send(500, err);
                else {
                  res.send(200);
                    // remove request from sent_request of traveler
                    models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, 
                    {$pull: {sent_requests: req.body.requestId}})  //remove requests matching req id
                    .exec((err, traveler) => {
                        if (err)
                        res.send(500, err);
                        else {

                        // message to the traveler
                        const message = {
                            icon: 'http://graph.facebook.com/' + group.owner.fb_id + '/picture?type=square',
                            type: 'approve_request',
                            title: 'Request Update',
                            body: group.owner.name + " has rejected your request",
                        };

                        const subject = {
                          fb_id: group.owner.fb_id,
                          name: group.owner.name,
                        }

                        utils.createNotification(message, subject, group)
                        .then(notification =>
                          models.User.findOneAndUpdate({fb_id: traveler.fb_id},
                          {$push: {'notifications': notification}})
                          .exec())
                        .then(user => utils.sendNotification(user.push_subscription, message));
                        
                      }
                    });
                }
                });
            }
        });
        }
    });
});

// rejects a request to join the group
//TODO: update notification and send it to all members
router.post('/cancel_request', (req, res) => {
  // find the request object
  models.Request.findById(req.body.requestId, (err, request) => {
      if (err)
      res.send(500, err);
      else {
      // find the group
      models.Group.findById(request.group)
      .exec((err, group) => {
          if (err)
          res.send(500, err);
          else {
          // remove received request from owner of the group
          models.User.findOneAndUpdate({fb_id: group.owner.fb_id}, 
              {$pull: {received_requests: req.body.requestId}})  //remove requests matching req id
              .exec((err) => {
              if (err)
                  res.send(500, err);
              else {
                  // remove request from sent_request of traveler
                  models.User.findOneAndUpdate({fb_id: request.traveler.fb_id}, 
                  {$pull: {sent_requests: req.body.requestId}})  //remove requests matching req id
                  .exec((err, traveler) => {
                      if (err)
                        res.send(500, err);
                      else
                        res.sendStatus(200);
                  });
              }
              });
          }
      });
      }
  });
});

module.exports = router;