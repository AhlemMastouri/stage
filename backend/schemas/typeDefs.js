const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type TypeAnomalie {
    id: ID!
    code: String!
    description: String!
    categorie: String!
  }
  input TypeAnomalieInput {
    code: String!
    description: String!
    categorie: String!
  }

  type Avion {
    id: ID!
    immatriculation: String!
    modele: String!
    configuration: String!
    date_mise_en_service: String!
    statut: String!
  }
  input AvionInput {
    immatriculation: String!
    modele: String!
    configuration: String!
    date_mise_en_service: String!
    statut: String!
  }

  type Escale {
    id: ID!
    code: String
    nom: String
    ville: String
    pays: String
    est_aeroport_principal: Boolean
  }
  input EscaleInput {
    code: String!
    nom: String!
    ville: String!
    pays: String!
    est_aeroport_principal: Boolean!
  }

  type Vol {
    id: ID!
    numero_vol: String!
    aeroport_depart: Escale
    aeroport_arrivee: Escale
    date_vol: String!
    heure_depart_prevue: String!
    heure_arrivee_prevue: String!
    avion_affecte: Avion
    statut: String
  }
  input VolInput {
    numero_vol: String!
    aeroport_depart: ID
    aeroport_arrivee: ID
    date_vol: String!
    heure_depart_prevue: String!
    heure_arrivee_prevue: String!
    avion_affecte: ID
    statut: String!
  }

  type Personnel {
    id: ID!
    matricule: String!
    nom: String!
    email: String!
    service: String!
    role: String!
  }
  input PersonnelInput {
    matricule: String!
    nom: String!
    email: String!
    service: String!
    role: String!
    mot_de_passe: String!
  }

  type Anomalie {
    id: ID!
    type_anomalie: TypeAnomalie!
    cause: String!
    avion: Avion
    vol: Vol
    escale: Escale
    actions_prises: String
    consequences: String!
    date_creation: String!
    date_modification: String!
    statut: String!
    signature: Personnel
    date_signature: String
    personnes_a_informer: [Personnel]
  }
  input AnomalieInput {
    type_anomalie: ID!
    cause: String!
    avion: ID
    vol: ID
    escale: ID
    actions_prises: String
    consequences: String
    personnes_a_informer: [ID!]
    statut: String
  }
 type User {
    id: ID!
    email: String!
    name: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }


  type Query {
    anomalies: [Anomalie!]!
    anomalie(id: ID!): Anomalie
    typesAnomalie(search: String): [TypeAnomalie!]!
    avions: [Avion!]!
    vols: [Vol!]!
    escales: [Escale!]!
    personnels: [Personnel!]!
    
  }

  type Mutation {
    creerPersonnel(personnelInput: PersonnelInput!): Personnel!
    creerAvion(avionInput: AvionInput!): Avion!
    mettreAJourAvion(id: ID!, avionInput: AvionInput!): Avion!
    supprimerAvion(id: ID!): Boolean!
    creerEscale(escaleInput: EscaleInput!): Escale!
    mettreAJourEscale(id: ID!, escaleInput: EscaleInput!): Escale!
    creerVol(volInput: VolInput!): Vol!
    mettreAJourVol(id: ID!, volInput: VolInput!): Vol!

    creerTypeAnomalie(typeAnomalieInput: TypeAnomalieInput!): TypeAnomalie!
    modifierStatutAvion(id: ID!, statut: String!): Avion
    creerAnomalie(anomalieInput: AnomalieInput!): Anomalie!
    modifierAnomalie(id: ID!, anomalieInput: AnomalieInput!): Anomalie!
    changerStatutAnomalie(id: ID!, statut: String!): Anomalie!
 
     login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
