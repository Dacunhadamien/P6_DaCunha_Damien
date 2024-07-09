const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // On extrait le token du header Authorization (contient le mot clé Bearer, donc on utilise la fonction split pour récupérer après l'espace dans le header)
    const token = req.headers.authorization.split(" ")[1];
    // On décode le token avec la fonction verify de JWT
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // On extrait le userId
    const userId = decodedToken.userId;
    // Et on le rajoute à l'objet req pour que les routes puissent l'exploiter
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
