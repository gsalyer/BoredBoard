const db = require("../conf/database");
module.exports = {
  getRecentPosts: function (req, res, next) {
    db.query("SELECT id, title, description, thumbnail FROM posts LIMIT 32")
      .then(function ([results, fields]) {
        if (results?.length) {
          res.locals.results = results;
        }
        next();
      })
      .catch((err) => next(err));
  },
  getPostById: function (req, res, next) {
    let postId = req.params.id;
    let baseSQL = `
        SELECT p.id, p.title, p.description, p.image, p.createdAt, u.username
        FROM posts p
        JOIN users u
        ON fk_authorId=u.id
        WHERE p.id=?;
        `;
    db.query(baseSQL, [postId])
      .then(function ([results, fields]) {
        if (results && results.length == 1) {
          res.locals.currentPost = results[0];
        }
        next();
      })
      .catch((err) => next(err));
  },
  getCommentsForPostsById: function (req, res, next) {
    let postId = req.params.id;
    let baseSQL = `
        SELECT c.id, c.text, c.createdAt, u.username
        FROM comments c
        JOIN users u
        ON fk_authorId=u.id
        WHERE fk_postId=?
        ORDER BY c.createdAt ASC;
        `;
    db.execute(baseSQL, [postId])
      .then(function ([results, fields]) {
        res.locals.currentPost.comments = results;
        next();
      })
      .catch((err) => next(err));
  },
};
