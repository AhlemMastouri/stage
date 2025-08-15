const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PersonnelSchema = new mongoose.Schema({
  matricule: {
    type: String ,
    
  },
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  service: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['technicien', 'responsable', 'administrateur'],
    default: 'technicien'
  },
  mot_de_passe: {
    type: String,
    required: true,
    minlength: 6
  }
});

PersonnelSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();
  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

PersonnelSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.mot_de_passe);
};

module.exports = mongoose.model('Personnel', PersonnelSchema);