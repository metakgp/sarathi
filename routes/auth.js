var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken')

// send an authentication request to facebook OAuth
router.get('/facebook', passport.authenticate("facebook"));

// This is the login redirect URI from the fb authentication server
// params - state-param : unique code to prevent csrf
// 
router.get('/facebook/callback', passport.authenticate("facebook", {
  failureRedirect: 'http://localhost:3000/login',
  session: false
}), (req, res) => {

  // generate web tokens
  var token = jwt.sign({fb_id: req.user.fb_id}, process.env.jwtSecret || 'thisismysecret', {expiresIn: '1h'});

  // redirect to success page with token as url parameter
  res.redirect('http://localhost:3000/loginRedirect?' + token);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send(200, "OK");
});

router.get('/login', (req, res) => {
  res.render('login.ejs', {user: req.user});
});

router.get('/status', (req, res) => {

  console.log(req.user);

  const token = req.headers['authorization'];
  if (!token)
    res.sendStatus(403);
  
  jwt.verify(token, process.env.jwtSecret || 'thisismysecret', (err, decoded) => {
    if (err)
      res.sendStatus(403);
    else 
      res.sendStatus(200);
  })
});



module.exports = router;