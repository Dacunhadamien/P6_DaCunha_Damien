//Import du model Books
const Book = require("../models/Book");
//Import de FS, donne accès aux fonctions qui permettent de modifier le système de fichiers
const fs = require("fs");
//Import de Sharp pour la compression d'images
const sharp = require("sharp");

// GESTION DU POST
exports.createBook = (req, res, next) => {
  // On parse le JSON pour transformer le texte en objet
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._userId;
  delete bookObject._id;
  console.log(bookObject);
  // On créer un nouveur thing, avec l'user ID provenant du token, et une URL d'image
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  // Si on a une image
  if (req.file) {
    const imagePath = `images/${req.file.filename}`;
    const optimizedImagePath = `images/optimized-${req.file.filename}`;
    //On compresse l'image
    sharp(imagePath)
      .resize(400, 600)
      .toFile(optimizedImagePath, (err, info) => {
        // Gestion d'erreur
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Mise à jour de l'image URL pour utiliser l'image optimisée
        book.imageUrl = `${req.protocol}://${req.get("host")}/images/optimized-${req.file.filename}`;
        // On supprime l'image originelle
        fs.unlink(imagePath, (err) => console.log(err));
        // Sauvegarder le livre avec l'image optimisée
        book
          .save()
          .then(() =>
            res.status(201).json({
              message: "Livre enregistré avec succès avec l'image optimisée !",
            })
          )
          .catch((error) => res.status(400).json({ error }));
      });
  } else {
    book
      .save()
      .then(() => res.status(201).json({ message: "Livre enregistré avec succès !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// GESTION DU DELETE
exports.deleteBook = (req, res, next) => {
  if (thing.userId != req.auth.userId) {
    res.status(403).json({ message: "Unauthorized requesr" });
    // Si le user est le bon
  } else {
    // On récupère l'objet dans la base de donnée
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // On recréer le filename
        const filename = book.imageUrl.split("/images/")[1];
        // On supprime le fichier, d'abord avec la function unlink pour le fichier, puis avec un callback pour le Thing
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
};

// GESTION DU GET OBJET UNIQUE
exports.getOneBook = (req, res, next) => {
  // On recherche un objet dont l'id est similaire à celui dans l'URL (params)
  Book.findOne({ _id: req.params.id })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

// GESTION DU GET ALL
exports.getAllBook = (req, res, next) => {
  // On recherche tout les objets
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// GESTION DU GET BEST RATED
exports.getBestRatedBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// GESTION DU PUT
exports.editBook = (req, res, next) => {
  // On vérifie que le user est le propriétaire du livre
  Book.findById(req.params.id)
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      }
      // On regarde si on a un fichier dans la requête
      const bookObject = req.file
        ? {
            //Si oui, on parse le JSON pour transformer le texte en objet
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : // Si non, on envoie directement le body de la requête
          { ...req.body };
      if (bookObject.imageUrl) {
        const imagePath = `images/${req.file.filename}`;
        const optimizedImagePath = `images/optimized-${req.file.filename}`;
        //On compresse l'image
        sharp(imagePath)
          .resize(400, 600)
          .toFile(optimizedImagePath, (err, info) => {
            // Gestion d'erreur
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Mise à jour de l'image URL pour utiliser l'image optimisée
            bookObject.imageUrl = `${req.protocol}://${req.get("host")}/images/optimized-${req.file.filename}`;
          });
      }
      // 1) quel est l'enregistrement à mettre à jour 2) avec quel objet on le met à jour
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre modifié" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// GESTION DE L'AJOUT D'UN RATING
exports.editRating = (req, res, next) => {
  const userId = req.body.userId;
  const { rating } = req.body;

  // Si le rating n'est pas entre 1 et 5, message d'erreur
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // On cherche le book
  Book.findById(req.params.id)
    .then((book) => {
      // Erreur si il n'existe pas
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      // On vérifie que le user en question n'a pas déjà noté ce livre
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ error: "User has already rated this" });
      }

      // On créer notre object avec la nouvelle note
      const newRating = { userId, grade: rating };
      // On la push dans le ratings Array du book trouvé par find
      book.ratings.push(newRating);

      // Gestion du averageRating
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
      book.averageRating = sumRatings / totalRatings;

      // On update le book dans la DB
      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};
