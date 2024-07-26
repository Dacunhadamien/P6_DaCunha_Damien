const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res, next) => {
  // Si on a une fichier dans req.file
  if (req.file) {
    // On vérifie l'existence du dossier "images", on le créer si il n'existe pas
    fs.access("./images", (error) => {
      if (error) {
        fs.mkdirSync("./images");
      }
    });
    // On extrait le path et le filename
    const { path, filename } = req.file;
    // On enlève l'extension et on ajoute ".webp"
    const ref = filename.split(".")[0] + ".webp";
    // On désactive le cache sharp
    sharp.cache(false);
    // On compresse l'image
    sharp(path)
      .resize(410)
      .webp({ quality: 20 })
      // On l'enregistre dans /images avec le nouveau nom
      .toFile("./images/" + ref)
      .then(() => {
        // Si la conversion à fonctionner, on update le filename
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
