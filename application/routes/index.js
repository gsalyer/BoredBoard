const express = require("express");
const { isLoggedIn } = require("../middleware/protector");
const {
  getRecentPosts,
  getPostById,
  getCommentsForPostsById,
} = require("../middleware/posts");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.render("home", { title: "CSC 317 App", name: "Garrett Salyer" });
});

router.get("/index", getRecentPosts, function (req, res) {
  res.render("index", { title: "CSC 317 App", name: "Garrett Salyer" }); //, { js: ["fetch.js"] }
});

router.get("/login", function (req, res) {
  res.render("login", { title: "CSC 317 App", name: "Garrett Salyer" });
});

router.get("/register", function (req, res) {
  res.render("registration", {
    title: "CSC 317 App",
    name: "Garrett Salyer",
    js: ["validation.js"],
  });
});

router.get("/postimage", isLoggedIn, function (req, res) {
  res.render("postimage", { title: "CSC 317 App", name: "Garrett Salyer" });
});

router.get(
  "/posts/:id(\\d+)",
  getPostById,
  getCommentsForPostsById,
  function (req, res) {
    res.render("viewpost", { title: "CSC 317 App", name: "Garrett Salyer" });
  }
);

module.exports = router;
