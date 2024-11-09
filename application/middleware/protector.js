module.exports = {
  isLoggedIn(req, res, next) {
    if (req.session.username) {
      next();
    } else {
      req.flash("error", "You must be logged in to view this page.");
      req.session.save((err) => {
        if (err) {
          next(err);
          res.redirect("/login");
        }
      });
    }
  },
};
