const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkerSchema = new Schema({
  titre:{
    type: String,
    require: true
  },
  image:{
    type: String,
    require: true
  },
  description:{
    type: String,
    require: true
  },
  zoom:{
    type:Number,
    require:true,
  },
  lat:{
    type:Number,
    require:true,
  },
  long:{
    type:Number,
    require:true,
  },
  cat_id: [{ type: Schema.Types.ObjectId, ref: 'Categorie' }],
  ville_id: [{ type: Schema.Types.ObjectId, ref: 'Ville' }]
});

const Marker = mongoose.model('Marker', MarkerSchema);

module.exports = Marker;
