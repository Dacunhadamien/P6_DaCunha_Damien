//import de mongoose
const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({
  _id: false,
  userId: { type: String, required: true },
  grade: { type: Number, required: true, min: 1 },
});

//On créer un schema mongoose, avec un objet type
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  ratings: { type: [ratingSchema], default: [] },
  averageRating: { type: Number },
});

//Export du schéma en model
module.exports = mongoose.model("Book", bookSchema);
