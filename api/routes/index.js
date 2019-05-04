var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/index').models;

router.get('/', (req, res) => {
  models.Group.find(req.query, { __v: 0}).exec((err, objects) => {
    res.send(objects);
  });
});

router.get('/group/:id', (req, res) => {
  models.Group.findOne({_id: req.params.id}, {_id: 0, __v: 0}).exec((err, object) => {
    res.send(object);
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
