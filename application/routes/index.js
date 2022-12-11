var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'CSC 317 App', name: "Garrett Salyer" })
})

router.get('/index', function (req, res) {
  res.render('index', { js: ["fetch.js"] });
});

router.get("/login", function (req, res) {
  res.render('login');
});

router.get("/register", function (req, res) {
  res.render('registration', { js: ["validation.js"] });
});

router.get("/postimage", function (req, res) {
  res.render('postimage');
});

router.get("/posts/default", function (req, res) { //:id(\\d+)
  res.render('viewpost');
});

module.exports = router;
