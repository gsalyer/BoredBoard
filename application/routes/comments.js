const express = require("express");
const router = express.Router();
const db = require("../conf/database");

// POST comment
router.post("/", function (req, res, next) {
  if (!req.session.userId) {
    res.json({
      status: "error",
      message: "You must be logged in",
    });
  } else {
    let { comment, postId } = req.body;
    let { userId, username } = req.session;
    let baseSQL = `
      INSERT INTO comments (text, fk_authorId, fk_postId)
      VALUE (?, ?, ?);
      `;
    db.execute(baseSQL, [comment, userId, postId]).then(function ([
      results,
      fields,
    ]) {
      if (results && results.affectedRows === 1) {
        res.json({
          status: "success",
          message: "Comment created",
          data: {
            comment: comment,
            username: username,
            commentId: results.insertId,
          },
        });
      } else {
        res.json({
          status: "error",
          message: "Comment failed",
        });
      }
    });
  }
});

module.exports = router;
