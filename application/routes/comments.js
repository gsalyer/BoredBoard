const express = require("express");
const router = express.Router();
const db = require("../conf/database");

router.post("/create", function (req, res, next) {
  if (!req.session.userId) {
    res.json({
      status: "error",
      message: "You must be logged in to create a comment",
    });
  } else {
    let { comment, postId } = req.body;
    let { userId, username } = req.session;
    console.log(comment, postId);
    try {
      db.execute(
        "INSERT INTO comments (text, fk_authorId, fk_postId) value (?, ?, ?);",
        [comment, userId, postId]
      ).then(function ([results, fields]) {
        if (results && results.affectedRows === 1) {
          res.json({
            status: "success",
            message: "Comment created",
            data: {
              commentId: results.insertId,
              comment: comment,
              username,
            },
          });
        } else {
          res.json({
            status: "error",
            message: "Comment could not be created",
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    console.log(req.body);
  }
});

module.exports = router;
