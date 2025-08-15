const mongoose = require('mongoose');

const TypeAnomalieSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TypeAnomalie', TypeAnomalieSchema);
