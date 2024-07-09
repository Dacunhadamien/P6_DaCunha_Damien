// On importe Express
const express = require("express");
// On importe le routing
const router = express.Router();

// On importe les fonctions pour le router
const userCtrl = require("../controllers/user");

//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req (req.body)
router.use(express.json());

// Nos différentes routes, les fonctions sont dans controllers
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
