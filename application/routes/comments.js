const express = require("express");
const router = express.Router();
const db = require("../conf/database");

// POST comment
router.post("/", (req, res) => {
  if (!req.session.userId) {
    res.json({
      status: "error",
      message: "You must be logged in",
    });
  } else {
    const { comment, postId } = req.body;
    const { userId, username } = req.session;
    const baseSQL = `
      INSERT INTO comments (text, fk_authorId, fk_postId)
      VALUE (?, ?, ?);
      `;
    db.execute(baseSQL, [comment, userId, postId]).then(([results]) => {
      if (results && results.affectedRows === 1) {
        res.json({
          status: "success",
          message: "Comment created",
          data: {
            comment,
            username,
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
