const mongoose = require('mongoose');

const VolSchema = new mongoose.Schema({
  numero_vol: {
    type: String,
    required: true,
    unique: true
  },
  aeroport_depart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escale',
    required: true
  },
  aeroport_arrivee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escale',
    required: true
  },
  date_vol: {
    type: Date,
    required: true
  },
  heure_depart_prevue: {
    type: String,
    required: true
  },
  heure_arrivee_prevue: {
    type: String,
    required: true
  },
  avion_affecte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Avion',
    required: true
  },
      statut:{type: String}
});

module.exports = mongoose.model('Vol', VolSchema);
