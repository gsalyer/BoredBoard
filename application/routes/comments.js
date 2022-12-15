const express = require("express");
const router = express.Router();
const db = require("../conf/database");

router.post("/create", function (req, res, next) {
  if (!req.session.userId) {
    res.json({
      status: "error",
      message: "You must be logged in to leave a comment",
    });
  } else {
    const commentText = req.body;
    const userId = req.session.userId;
    const postId = req.session.postId;
    let baseSQL = `
      INSERT INTO comments (text, fk_authorId)
      VALUES (?, ?);
      `;
    db.query(baseSQL, [commentText, userId])
      .then(function ([results, fields]) {
      if (results && results.affectedRows) {
        req.flash("success", "Post created successfully.");
        req.session.save(function (saveErr) {
          res.redirect(`/posts/`);
        });
      }
    });
  }
});

module.exports = router;
