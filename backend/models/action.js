const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  id_action: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Action', ActionSchema);