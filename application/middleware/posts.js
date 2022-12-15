const db = require("../conf/database");
module.exports = {
  getRecentPosts: function (req, res, next) {
    db.query("SELECT id, title, description, thumbnail FROM posts LIMIT 8")
      .then(function ([results, fields]) {
        if (results && results.length) {
          res.locals.results = results;
        }
        next();
      })
      .catch((err) => next(err));
  },
};
