var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;

router.get('/', (req, res) => {
  models.Group.find({}, {__v: 0}).exec((err, objects) => {
    res.send(objects);
  });
});

// creates a group for the user
router.post('/create_group', (req, res) => {
  var traveler = {
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
  grp.save((err) => {
    if (err)
      res.send(500, "error creating group");
    else
      res.send(200, "OK");
  });
});

// sends a join request to the owner of the group
router.post('/join_request', (req, res) => {
  var traveler = {
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
  };
  models.Group.findById(req.body.id).exec((err, object) => {
    var request = models.Request({
      group: object,
      traveler: traveler,
    });
    request.save((err) => {
      if (err)
        res.send(500, "Error creating request");
      else {
        // add those requests to the users concerned
        models.User.findOneAndUpdate({name: req.body.name}, {$push: {sent_requests: request}})
        .exec((err, object) => {
          if (err)
            res.send(500, "Error adding sent request to user");
        });
        models.User.findOneAndUpdate({name: object.owner.name}, {$push: {received_requests: request}})
        .exec((err, object) => {
          if (err)
            res.send(500, "Error adding received request to user");
          else
            res.send(200, "OK");
        });
      }
    });
  });
});

// approves a request to join the group
//TODO: update notification and send it to all members
router.post('/approve_request', (req, res) => {
  var traveler = {
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
      models.User.findOneAndUpdate({name: req.body.name}, 
        {$pull: {sent_requests: req.body.requestId}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
        });
      
      // remove request from recieved_request from group owner
      models.User.findOneAndUpdate({name: object.owner.name}, 
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
      models.User.findOneAndUpdate({name: req.body.name}, 
        {$pull: {sent_requests: req.body.requestId}})  //remove requests matching req id
        .exec((err, object) => {
          if (err)
            res.send(500, "error removing request from user");
        });
      
      // remove request from recieved_request from group owner
      models.User.findOneAndUpdate({name: object.owner.name}, 
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

router.get('/login', (req, res) => {
  res.send("This is the login page");
});

router.get('/test', (req, res) => {
  models.Request.find({}).populate('group').exec((err, objects) => {
    res.send(objects);
  });
});


module.exports = router;
