var express = require('express');
const { isLoggedIn } = require('../middleware/protector')
const { getRecentPosts } = require('../middleware/posts')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'CSC 317 App', name: "Garrett Salyer" })
})

router.get('/index', getRecentPosts, function (req, res) {
  res.render("index"); //, { js: ["fetch.js"] }
});

router.get("/login", function (req, res) {
  res.render('login');
});

router.get("/register", function (req, res) {
  res.render('registration', /*{ js: ["validation.js"] }*/);
});

router.get("/postimage", isLoggedIn, function (req, res) {
  res.render('postimage');
});

router.get("/posts/:id(\\d+)", function (req, res) {
  res.render('viewpost');
});

module.exports = router;
