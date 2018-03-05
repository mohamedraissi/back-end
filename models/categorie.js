const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorieSchema = new Schema({
  nom:{
    type: String,
    require: true
  },
});

const Categorie = mongoose.model('Categorie', CategorieSchema);

module.exports = Categorie;
