const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// GESTION DU STOCKAGE DE FICHIER
const storage = multer.diskStorage({
  // On indique où on enregistre les images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // On indique le nom du fichier
  filename: (req, file, callback) => {
    // On génère un nom en partant du nom original, auquel on enlève les espaces et on les remplaces par des underscores
    const name = file.originalname.split(" ").join("_");
    // On créer l'extension du fichier en fonction du mime type
    const extension = MIME_TYPES[file.mimetype];
    // On génère le nom entier du fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
