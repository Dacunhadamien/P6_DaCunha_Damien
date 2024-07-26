// Import de Mongoose
const mongoose = require("mongoose");
// Import de Unique validator de Mongoose
const uniqueValidator = require("mongoose-unique-validator");

// Création du schéma User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On applique Unique Validator sur notre schéma, pour bien vérifier que le compte est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
