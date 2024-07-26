Pour lancer le server :

Utilisez la commande : npm start ou utilisez Nodemon (voir "Installer nodemon si besoin)

----------------------------------------------------------------

Installer nodemon : npm install -g nodemon
Puis, so Nodemon est installé, utilisez la commande  : nodemon server

Pour l'accès à la base de donnée MondoDB, créer à la racine du dossier backend un fichier .env contenant : 
MONGODB_URL="mongodb+srv://damiendacunha64:test123@cluster0.6ewfsky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=RANDOM_TOKEN_SECRET