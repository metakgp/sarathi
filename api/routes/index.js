var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send("This is the home page");
});

router.get('/search', (req, res) => {
  res.send("This is the search form");
});

router.get('/login', (req, res) => {
  res.send("This is the login page");
});

module.exports = router;
