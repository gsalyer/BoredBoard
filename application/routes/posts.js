const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../conf/database");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${fileExt}`
    );
  },
});
const upload = multer({ storage: storage });

// local:3000/posts/create
router.post("/create", upload.single("uploadImage"), function (req, res, next) {
  if (req.file.path == undefined || req.file.filename == undefined) {
    req.flash("error", "Post could not be created");
    req.session.save(function (saveError) {
      res.redirect("posts");
    });
  } else {
    let uploadedFile = req.file.path;
    let thumbnailName = "thumbnail-" + req.file.filename;
    let thumbnailPath = req.file.destination + "/" + thumbnailName;

    const { title, description } = req.body;
    const userId = req.session.userId;
    sharp(uploadedFile)
      .resize(300, 300, {
        fit: 'inside'
      })
      .toFile(thumbnailPath)
      .then(function () {
        let baseSQL = `
            INSERT INTO posts (title, description, image, thumbnail, fk_authorId) 
            VALUE (?, ?, ?, ?, ?);
            `;
        return db.query(baseSQL, [
          title,
          description,
          uploadedFile,
          thumbnailPath,
          userId,
        ]);
      })
      .then(function ([results, fields]) {
        if (results && results.affectedRows == 1) {
          req.flash("success", "Post created successfully");
          req.session.save(function (saveError) {
            res.redirect("/index");
          });
        } else {
          req.flash("error", "Post could not be created");
          req.session.save(function (saveError) {
            res.redirect("/");
          });
        }
      })
      .catch(function (err) {
        next(err);
      });
  }
});

// local:3000/posts/search
router.get("/search", function (req, res, next) {
  let q = `%${req.query.q}%`;
  let originalSearchTerm = req.query.q;
  let baseSQL = `
      SELECT id, title, description, thumbnail, concat_ws(" ", title, description) as haystack
      FROM posts
      HAVING haystack like ?;
      `;
  db.execute(baseSQL, [q])
    .then(function ([results, fields]) {
      if (results.length > 0) {
        res.locals.results = results;
        res.locals.searchValue = originalSearchTerm;
        req.flash("success", `${results.length} results found`);
        req.session.save(function (saveError) {
          res.render("index");
        });
      } else {
        let baseSQL = `
        SELECT id, title, description, thumbnail 
        FROM posts ORDER BY createdAt DESC LIMIT 3;
        `;
        db.execute(baseSQL).then(function ([results, fields]) {
          res.locals.results = results;
          req.session.save(function (saveError) {
            req.flash("error", `No results found`);
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
