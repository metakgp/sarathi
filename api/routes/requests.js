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
  
                // // send request notication to this user (the owner of the group)
                // const message = JSON.stringify({
                //   type: 'join_request',
                //   title: 'Join Request',
                //   body: user.name + " has sent a join request",
                // });
                
                // webpush.sendNotification(JSON.parse(owner.push_subscription), message)
                // .catch(err => console.log(err))
                // .then(() => res.sendStatus(200));
                res.sendStatus(200);
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
                        res.send(200);
                        // message to all the members of the group
                        // const message = {
                        //   type: 'approve_request',
                        //   title: 'Group Update',
                        //   body: traveler.name + " has joined the group",
                        // };

                        // utils.createAndSendNotification(message, request, undefined, (err, notif) => {
                        //   message_string = JSON.stringify(message);
                        
                        //   // sending notification to all members of the group
                        //   // add notification ids to each of these users
                        //   group.members.map((member) => {
                        //     models.User.findOneAndUpdate({fb_id: member.fb_id}, 
                        //       {$push: {'notifications': notif}})
                        //     .exec((err, user) => {
                        //       webpush.sendNotification(JSON.parse(user.push_subscription), message_string)
                        //       .catch(err => console.log(err));
                        //     });
                        //   });
    
                        //   // message to the traveler
                        //   const message2 = {
                        //     type: 'approve_request',
                        //     title: 'Request Update',
                        //     body: group.owner.name + " has accepted your request",
                        //   };

                        //   webpush.sendNotification(traveler.push_subscription, JSON.stringify(message2))
                        //   .catch(err => console.log(err))
                        //   .then(() => res.sendStatus(200));
                        // });
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
                        // const message = {
                        //     type: 'approve_request',
                        //     title: 'Request Update',
                        //     body: group.owner.name + " has rejected your request",
                        // };
                        
                        // webpush.sendNotification(traveler.push_subscription, JSON.stringify(message))
                        // .catch(err => console.log(err))
                        // .then(() => res.sendStatus(200));
                      }
                    });
                }
                });
            }
        });
        }
    });
});

router.get('/change_time', (req, res) => {
  res.render('change_time.ejs');
});

router.post('/change_time', (req, res) => {
  
  models.Group.findByIdAndUpdate(req.body.groupId, {departure: new Date(req.body.departure)})
  .exec((err, group) => {
    if (err)
      res.send(err);
    else {
      res.send(200);
      // const message = {
      //   type: 'change_time',
      //   title: 'Time change',
      //   body: group.owner.name + ' has changed the departure time'
      // };

      // utils.createAndSendNotification(message, group, undefined, (err, notif) => {
      //   for (var i = 0; i < group.members.length; i++) {
      //     // send notif to each user and add notid if
      //     models.User.findOneAndUpdate({fb_id: group.members[i].fb_id}, {$push: {'notifications': notif}})
      //     .exec((err, user) => {
      //       if (err)
      //         res.send(err);
      //       else {
      //         webpush.sendNotification(JSON.parse(user.push_subscription), JSON.stringify(message))
      //         .catch(err => console.log(err));
      //       }
      //     });
      //   }
      //   res.sendStatus(200);
      // });
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