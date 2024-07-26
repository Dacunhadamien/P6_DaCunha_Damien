const multer = require("multer");

const storage = multer.diskStorage({
  // On définit le folder d'enregistrement, ici "images"
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // On définit le nom du fichier. Ici, on remplace les espaces par des underscores, ainsi que la date de mise en ligne concaténée.
    const name = file.originalname.split(" ").join("_");
    callback(null, Date.now() + name);
  },
});

module.exports = multer({ storage }).single("image");
