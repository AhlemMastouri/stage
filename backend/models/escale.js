const mongoose = require("mongoose");

const EscaleSchema = new mongoose.Schema({
  code: { type: String, required: true },
  nom: { type: String, required: true },
  ville: { type: String, required: true },
  pays: { type: String, required: true },
  est_aeroport_principal: { type: Boolean, required: true }
});

module.exports = mongoose.model("Escale", EscaleSchema);

