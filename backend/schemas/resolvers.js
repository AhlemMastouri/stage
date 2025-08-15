const Anomalie = require("../models/anomalie");
const TypeAnomalie = require("../models/typeAnomalie");
const Avion = require("../models/avion");
const Escale = require("../models/escale");
const Vol = require("../models/vol");
const Personnel = require("../models/personnel");
const User = require('../models/user'); // chemin à adapter selon ton projet
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    anomalies: async () => {
      const anomalies = await Anomalie.find()
        .populate("type_anomalie")
        .populate("avion")
        .populate("vol")
        .populate("escale")
      
        .populate("signature")
        .populate("personnes_a_informer");
      // Filtrer pour éviter erreur si type_anomalie absent
      return anomalies.filter(a => a.type_anomalie != null);
    },
    anomalie: async (_, { id }) => {
      return await Anomalie.findById(id)
        .populate("type_anomalie")
        .populate("avion")
        .populate("vol")
        .populate("escale")
        
        .populate("signature")
        .populate("personnes_a_informer");
    },
  
  typesAnomalie: async (_, { search }) => {
    if (!search || search.trim() === "") {
      return await TypeAnomalie.find();
    }
    const regex = new RegExp(search, "i");
    return await TypeAnomalie.find({
      $or: [
        { code: regex },
        { description: regex },
        { categorie: regex },
      ],
    });
  },
  // ... autres resolvers}

    avions: async () => await Avion.find(),
    vols: async () =>
      await Vol.find()
        .populate("aeroport_depart")
        .populate("aeroport_arrivee")
        .populate("avion_affecte"),
    escales: async () => await Escale.find(),
    personnels: async () => await Personnel.find(),
    
  },

  Mutation: {
  
login: async (_, { email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email ou mot de passe incorrect');

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name }
  };
},


    creerPersonnel: async (_, { personnelInput }) => {
      const personnel = new Personnel(personnelInput);
      return await personnel.save();
    },

    creerAvion: async (_, { avionInput }) => {
      const avion = new Avion(avionInput);
      return await avion.save();
    },

    mettreAJourAvion: async (_, { id, avionInput }) => {
      return await Avion.findByIdAndUpdate(id, avionInput, { new: true });
    },

  

    creerEscale: async (_, { escaleInput }) => {
      const escale = new Escale(escaleInput);
      return await escale.save();
    },

    mettreAJourEscale: async (_, { id, escaleInput }) => {
      return await Escale.findByIdAndUpdate(id, escaleInput, { new: true });
    },


    creerVol: async (_, { volInput }) => {
      const vol = new Vol(volInput);
      return await vol.save();
    },
      mettreAJourVol: async (_, { id, volInput }) => {
      const updatedVol = await Vol.findByIdAndUpdate(
        id,
        { ...volInput },
        { new: true }
      ).populate([
        "aeroport_depart",
        "aeroport_arrivee",
        "avion_affecte",
      ]);

      if (!updatedVol) {
        throw new Error("Vol introuvable");
      }

      return updatedVol;
    },

  creerAnomalie: async (_, { anomalieInput }) => {
      try {
        const anomalie = new Anomalie({
          ...anomalieInput,
          date_creation: new Date().toISOString(),
          date_modification: new Date().toISOString(),
          statut: anomalieInput.statut || "ouvert"
        });
        const saved = await anomalie.save();
        return await saved.populate([
          "type_anomalie",
          "avion",
          "vol",
          "escale",
          "signature",
          "personnes_a_informer"
        ]);
      } catch (error) {
        throw new Error(`Erreur création anomalie: ${error.message}`);
      }
    },
    changerStatutAnomalie: async (_, { id, statut }) => {
      return await Anomalie.findByIdAndUpdate(
        id,
        { statut, date_modification: new Date() },
        { new: true }
      ).populate("type_anomalie");
    },
  


creerTypeAnomalie: async (_, { typeAnomalieInput }) => {
  const nouveauType = new TypeAnomalie(typeAnomalieInput);
  return await nouveauType.save();
},

  
  

    changerStatutAnomalie: async (_, { id, statut }) => {
      return await Anomalie.findByIdAndUpdate(
        id,
        { statut, date_modification: new Date() },
        { new: true }
      ).populate("type_anomalie");
    },

   
 
  modifierStatutAvion: async (_, { id, statut }) => {
    const avionUpdated = await Avion.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    );
    if (!avionUpdated) {
      throw new Error("Avion introuvable");
    }
    return avionUpdated;
  
},
  },
};

module.exports = resolvers;
