var express = require('express');
var router = express.Router();
var passport = require('passport');

// send an authentication request to facebook OAuth
router.get('/facebook', passport.authenticate("facebook"));

// This is the login redirect URI from the fb authentication server
// params - state-param : unique code to prevent csrf
// 
router.get('/facebook/callback', passport.authenticate("facebook", {
  successRedirect: 'http://localhost:3000/',
  failureRedirect: 'http://localhost:3000/login',
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.send(200, "OK");
});

router.get('/login', (req, res) => {
  res.render('login.ejs', {user: req.user});
});

module.exports = router;