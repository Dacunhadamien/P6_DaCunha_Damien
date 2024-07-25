const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res, next) => {
  if (req.file) {
    fs.access("./images", (error) => {
      if (error) {
        fs.mkdirSync("./images");
      }
    });
    const { path, filename } = req.file;
    const ref = filename.split(".")[0] + ".webp";
    sharp.cache(false);
    sharp(path)
      .resize(410)
      .webp({ quality: 20 })
      .toFile("./images/" + ref)
      .then(() => {
        req.file.filename = ref;
        fs.unlink(path, () => {
          next();
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    next();
  }
};
