const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserError = require("../helpers/error/UserError");
const db = require("../conf/database");

//POST
//localhost:3000/users/register
router.post("/register", function (req, res, next) {
  const { username, email, password } = req.body;

  //serverside validation

  //check for duplicates
  db.query("select id from users where username=?", [username])
    .then(function ([results]) {
      if (results && results.length == 0) {
        return db.query("select id from users where email=?", [email]);
      } else {
        throw new UserError("Username already exists.", "/register", 200);
      }
    })
    .then(function ([results]) {
      if (results && results.length == 0) {
        return bcrypt.hash(password, 2);
      } else {
        throw new UserError("Email already exists.", "/register", 200);
      }
    })
    .then(function (hashedPassword) {
      return db.query(
        "insert into users (username, email, password) value (?, ?, ?)",
        [username, email, hashedPassword]
      );
    })
    .then(function ([results]) {
      if (results && results.affectedRows == 1) {
        res.redirect("/login");
      } else {
        throw new UserError("Unable to create user.", "/register", 200);
      }
    })
    .catch(function (err) {
      if (err instanceof UserError) {
        req.flash("error", err.getMessage());
        req.session.save(function () {
          res.redirect(err.getRedirectURL());
        });
      } else {
        next(err);
      }
    });

  //insert into db
  //respond
});

//localhost:3000/users/login
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  let loggedUserId;
  let loggedUsername;
  db.query("select id, username, password from users where username=?", [
    username,
  ])
    .then(function ([results]) {
      if (results && results.length == 1) {
        loggedUserId = results[0].id;
        loggedUsername = results[0].username;
        let dbPassword = results[0].password;
        return bcrypt.compare(password, dbPassword);
      } else {
        throw new UserError("Failed login: invalid credentials", "/login", 200);
      }
    })
    .then(function (passwordsMatched) {
      if (passwordsMatched) {
        req.session.userId = loggedUserId;
        req.session.username = loggedUsername;
        req.flash("success", `${loggedUsername}, you are now logged in.`);
        req.session.save(function () {
          res.redirect("/");
        });
      } else {
        throw new UserError("Failed login: invalid credentials", "/login", 200);
      }
    })
    .catch(function (err) {
      if (err instanceof UserError) {
        req.flash("error", err.getMessage());
        req.session.save(function () {
          res.redirect(err.getRedirectURL());
        });
      } else {
        next(err);
      }
    });
});

//localhost:3000/users/logout
router.post("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    } else {
      res.json({
        status: 200,
        message: "logged out",
      });
    }
  });
  //res.redirect("/");
});

module.exports = router;
