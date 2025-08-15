import {  gql } from "@apollo/client"


// === QUERIES ===
export const GET_AVIONS = gql`
  query {
    avions {
      id
      immatriculation
      modele
      configuration
      date_mise_en_service
      statut
    }
  }
`;

// === MUTATION ===
export const CREER_AVION = gql`
  mutation CreerAvion($avionInput: AvionInput!) {
    creerAvion(avionInput: $avionInput) {
      id
      immatriculation
      modele
      configuration
      date_mise_en_service
      statut
    }
  }
`;