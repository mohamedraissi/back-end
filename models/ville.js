const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VilleSchema = new Schema({
    nom:{
        type: String,
        require: true
      },
    image:{
        type: String,
        require: true, 
      },
      description:{
        type: String,
        require: true,   
      },
      desc_extra:{
        type: String,
        require: true,   
      },
      gouvernorat:{
        type: String,
        require: true,
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
});
const Ville = mongoose.model('Ville', VilleSchema);

module.exports = Ville;