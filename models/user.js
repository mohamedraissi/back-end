const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  prenom:{
    type: String,
    require: true
  },
  nom:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require:true,
    unique: true,
    index: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  password:{
    type: String,
    require: true
  },
  tel:{
    type:String,
    require:true,
  },
  adresse:{
    type:String,
    require:true,
  },
  role:{
    type:String,
    require:true,
    enum: ['client', 'adminP','adminS'],
    default: 'client'
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
