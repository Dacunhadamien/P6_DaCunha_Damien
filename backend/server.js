const http = require("http");
const app = require("./app");

// On normalize le numéro du port
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  //Si le port est un nombre, on return sa valeur
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
    // Sinon on return false
  }
  return false;
};

// On set le port avec la valeur environnement ou 4000
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// On créer le server
const server = http.createServer(app);

// On attache la gestion d'erreur au server
server.on("error", errorHandler);

// On gère l'ecoute du server
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
