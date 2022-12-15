var express = require('express');
const { isLoggedIn } = require('../middleware/protector')
const { getRecentPosts, getPostById, getCommentsForPostsById } = require('../middleware/posts')
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

router.get("/posts/:id(\\d+)", getPostById, getCommentsForPostsById, function (req, res) {
  res.render('viewpost');
});

router.get("/posts/search", function (req, res, next) {
  let searchTerm = `%${req.query.searchTerm}%`;
  let originalSearchTerm = req.query.searchTerm;
  let baseSQL = `select id, title, description, thumbnail, concat_ws(" ", title, description) as haystack
   FROM posts
   HAVING haystack like ?
   ORDER BY createdAt DESC;`;
  db.execute(baseSQL, [searchTerm])
    .then(function ([results, fields]) {
      if (results.length > 0) {
        res.locals.results = results;
        res.locals.searchValue = req.query.originalSearchTerm;
        req.flash("success", `${results.length} results found`);
        req.session.save(function (saveError) {
          res.render("index");
        });
      } else {
        let baseSQL = `select id, title, description, thumbnail from posts ORDER BY createdAt DESC LIMIT 3;`;

        db.execute(baseSQL).then(function ([results, fields]) {
          res.locals.results = results;
          req.session.save(function (saveError) {
            req.flash("error", `No results found, here are some suggestions`);
            res.render("index");
          });
        });
      }
    })
    .catch(function (err) {
      next(err);
    });
});


module.exports = router;
