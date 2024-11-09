const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../conf/database");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename(req, file, cb) {
    const fileExt = file.mimetype.split("/")[1];
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${fileExt}`
    );
  },
});
const upload = multer({ storage });

// local:3000/posts/create
router.post("/create", upload.single("uploadImage"), (req, res, next) => {
  if (req.file.path === undefined || req.file.filename === undefined) {
    req.flash("error", "Post could not be created");
    req.session.save((err) => {
      if (err) {
        next(err);
      }
      res.redirect("posts");
    });
  } else {
    const uploadedFile = req.file.path;
    const thumbnailName = `thumbnail-${req.file.filename}`;
    const thumbnailPath = `${req.file.destination}/${thumbnailName}`;

    const { title, description } = req.body;
    const userId = req.session.userId;
    sharp(uploadedFile)
      .resize(300, 300, {
        fit: "inside",
      })
      .toFile(thumbnailPath)
      .then(() => {
        const baseSQL = `
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
      .then(([results]) => {
        if (results && results.affectedRows === 1) {
          req.flash("success", "Post created successfully");
          req.session.save((err) => {
            if (err) {
              next(err);
            }
            res.redirect("/index");
          });
        } else {
          req.flash("error", "Post could not be created");
          req.session.save((err) => {
            if (err) {
              next(err);
            }
            res.redirect("/");
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.get("/search", (req, res, next) => {
  if (!req.query.q || req.query.q.trim() === "") {
    req.flash("error", "Search term cannot be empty");
    return res.redirect("/");
  }
  const query = `%${req.query.q}%`;
  const originalSearchTerm = req.query.q;
  const baseSQL = `
      SELECT id, title, description, thumbnail, concat_ws(" ", title, description) as haystack
      FROM posts
      HAVING haystack like ?;
      `;
  db.execute(baseSQL, [query])
    .then(([results]) => {
      if (results.length > 0) {
        res.locals.results = results;
        res.locals.searchValue = originalSearchTerm;
        req.flash("success", `${results.length} results found`);
        req.session.save((err) => {
          if (err) {
            next(err);
          }
          res.render("index");
        });
      } else {
        const baseSQL = `
        SELECT id, title, description, thumbnail 
        FROM posts ORDER BY createdAt DESC LIMIT 3;
        `;
        db.execute(baseSQL).then(([results]) => {
          res.locals.results = results;
          req.session.save((err) => {
            if (err) {
              next(err);
            }
            req.flash("error", "No results found");
            res.render("index");
          });
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
