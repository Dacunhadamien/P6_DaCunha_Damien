// Import de bcrypt
const bcrypt = require("bcrypt");
// Import du schéma User
const User = require("../models/User");
// Import de jsonwebtoken
const jwt = require("jsonwebtoken");

// GESTION DE LA CREATION DE COMPTE
exports.signup = (req, res, next) => {
  bcrypt
    // On prend le password et on le fait tourner dans l'algorythme bcrypt 10 fois
    .hash(req.body.password, 10)
    .then((hash) => {
      //On créer un const user qui contient l'email et le password crypté
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //On enregistre dans la base de donnée
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// GESTION DU LOGIN
exports.login = (req, res, next) => {
  // On recherche l'email correspondant
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      // Si le user n'existe pas dans la database, on renvoie une erreur 401 et un message
      if (!user) {
        res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        // Sinon, on compare les résultats cryptés du mot de passe tapé et de celui dans la database
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // Si c'est invalide, status 401 et message
            if (!valid) {
              res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });
              // Si c'est valide, status 200 et on renvoie une paire userId et un token généré par JWT
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.staturs(500).json({ error });
    });
};
