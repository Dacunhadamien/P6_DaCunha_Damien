// On importe Express
const express = require("express");
// On importe le routing
const router = express.Router();
const sharp = require("../middleware/sharp_config");

// On importe les fonctions pour le router
const booksCtrl = require("../controllers/books");

// On importe l'authentification
const auth = require("../middleware/auth");

// On importe Multer
const multer = require("../middleware/mutler-config");

//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req (req.body)
router.use(express.json());

// Nos différentes routes, les fonctions sont dans controllers, avec authentification.

router.post("/", auth, multer, sharp, booksCtrl.createBook);
router.put("/:id", auth, multer, sharp, booksCtrl.editBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/", booksCtrl.getAllBook);
router.post("/:id/rating", auth, booksCtrl.editRating);
router.get("/bestrating", booksCtrl.getBestRatedBook);
router.get("/:id", booksCtrl.getOneBook);

module.exports = router;
