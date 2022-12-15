const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const db = require("../conf/database");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename: function (req, file, cb) {
    // image/jpg
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

router.post("/create", upload.single("uploadImage"), function (req, res, next) {
  let uploadedFile = req.file.path;
  let thumbnailName = `thumb-${req.file.filename}`;
  let destinationOfThumbnail = `${req.file.destination}/${thumbnailName}`;
  const { title, desc } = req.body;
  const userId = req.session.userId;

  sharp(uploadedFile)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
      let badeSQL = `INSERT INTO posts (title, description, image, thumbnail, fk_authorId) VALUES (?, ?, ?, ?, ?)`;
      return db.query(badeSQL, [title, desc, uploadedFile, destinationOfThumbnail, userId]);
    })
    .then(function ([results, fields]) {
      if (results && results.affectedRows) {
        req.flash("success", "Post created successfully.");
        req.session.save(function (saveErr) {
          res.redirect("/");
        });
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
