const mongoose = require("mongoose");

const AnomalieSchema = new mongoose.Schema({
  type_anomalie: { type: mongoose.Schema.Types.ObjectId, ref: "TypeAnomalie", required: true },
  cause: { type: String, required: true },
  avion: { type: mongoose.Schema.Types.ObjectId, ref: "Avion" },
  vol: { type: mongoose.Schema.Types.ObjectId, ref: "Vol" },
  escale: { type: mongoose.Schema.Types.ObjectId, ref: "Escale" },
  actions_prises: { type: String, required: true },

  consequences: { type: String, required: true },
  statut: { type: String, default: "Ouverte" },
  signature: { type: mongoose.Schema.Types.ObjectId, ref: "Personnel" },
  personnes_a_informer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Personnel" }],
  date_creation: { type: Date, default: Date.now },
  date_modification: { type: Date, default: Date.now },
});

const Anomalie = mongoose.model("Anomalie", AnomalieSchema);
module.exports = Anomalie;
