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
    console.log(uploadedFile);
    let thumbnailName = "thumbnail-" + req.file.filename;
    let thumbnailPath = req.file.destination + "/" + thumbnailName;

    const { title, description } = req.body;
    const userId = req.session.userId;
    sharp(uploadedFile)
      .resize(200, 200)
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
  
})

module.exports = router;
