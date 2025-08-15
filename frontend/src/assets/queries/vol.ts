import { gql } from "@apollo/client";

export const GET_VOLS = gql`
  query GetVols($dateRange: DateRangeInput) {
    vols(dateRange: $dateRange) {
      id
      numero_vol
      aeroport_depart {
        id
        code
        nom
      }
      aeroport_arrivee {
        id
        code
        nom
      }
      date_vol
      heure_depart_prevue
      heure_arrivee_prevue
      avion_affecte {
        id
        immatriculation
        modele
      }
      statut
      createdAt
      updatedAt
    }
  }
`;

export const CREER_VOL = gql`
  mutation CreerVol($volInput: VolInput!) {
    creerVol(volInput: $volInput) {
      id
      numero_vol
      statut
    }
  }
`;

export const UPDATE_VOL = gql`
  mutation ModifierVol($id: ID!, $volInput: VolInput!) {
    mettreAJourVol(id: $id, volInput: $volInput) {
      id
      numero_vol
      statut
    }
  }
`;

export const DELETE_VOL = gql`
  mutation SupprimerVol($id: ID!) {
    supprimerVol(id: $id)
  }
`;