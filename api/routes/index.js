var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;

router.get('/', (req, res) => {
  models.Group.find({}, {__v: 0}).exec((err, objects) => {
    res.send(objects);
  });
});

router.get('/create_group', (req, res) => {
  var username = get_username();
  var traveler = {
    name: username,
    from: req.query.from,
    to: req.query.to,
    time: req.query.time,
  };
  var grp = models.Group({
    from: req.query.from,
    to: req.query.to,
    owner: traveler,
    members: [traveler],
    departure: req.query.time,
    status: 'open',
  });
  grp.save((err) => {
    if (err)
      res.send(500, "error creating group");
    else
      res.send(200, "OK");
  });
});

router.get('/join_request/:id', (req, res) => {
  var username = get_username();
  var traveler = {
    name: username,
    from: req.query.from,
    to: req.query.to,
    time: req.query.time,
  };
  models.Group.findById(req.params.id).exec((err, object) => {
    var req = models.Request({
      group: object,
      traveler: traveler,
    });
    req.save((err) => {
      if (err)
        res.send(500, "Error creating request");
      else {
        // add those requests to the users concerned
        models.User.findOneAndUpdate({name: username}, {$push: {sent_requests: req}})
        .exec((err, object) => {
          if (err)
            res.send(500, "Error adding sent request to user");
        });
        models.User.findOneAndUpdate({name: object.owner.name}, {$push: {sent_requests: req}})
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

router.post('/search', (req, res) => {
  res.redirect(301, url.format({
    pathname: '/',
    query: req.body,
  }));
});

router.get('/login', (req, res) => {
  res.send("This is the login page");
});


module.exports = router;
