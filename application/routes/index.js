var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CSC 317 App', name: "Garrett Salyer" });
});

router.get("/login", function (req, res) {
  res.render('login');
});

router.get("/register", function (req, res) {
  res.render('registration');
});

router.get("/postimage", function (req, res) {
  res.render('postimage');
});

router.get("/posts/:id(\\d+)", function (req, res) {
  res.render('viewpost');
});

module.exports = router;
