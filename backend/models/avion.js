const mongoose = require('mongoose');

const AvionSchema = new mongoose.Schema({
  immatriculation: {
    type: String,
    required: true,
    unique: true
  },
  modele: {
    type: String,
    required: true
  },
  configuration: {
    type: String,
    required: true
  },
  date_mise_en_service: {
    type: Date,
    required: true
  },
  statut: {
    type: String,
    enum: ['hors_service', 'maintenance', 'en_service'],
    default: 'actif'
  }
});

module.exports = mongoose.model('Avion', AvionSchema);
