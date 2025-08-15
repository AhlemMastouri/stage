import { gql } from "@apollo/client";

export const GET_ESCALES = gql`
  query GetEscales($filter: EscaleFilterInput) {
    escales(filter: $filter) {
      id
      code
      nom
      ville
      pays
      est_aeroport_principal
      createdAt
      updatedAt
    }
  }
`;

export const CREER_ESCALE = gql`
  mutation CreerEscale($escaleInput: EscaleInput!) {
    creerEscale(escaleInput: $escaleInput) {
      id
      code
      nom
      ville
      pays
      est_aeroport_principal
    }
  }
`;

export const UPDATE_ESCALE = gql`
  mutation ModifierEscale($id: ID!, $escaleInput: EscaleInput!) {
    mettreAJourEscale(id: $id, escaleInput: $escaleInput) {
      id
      code
      nom
      ville
      pays
      est_aeroport_principal
    }
  }
`;

export const DELETE_ESCALE = gql`
  mutation SupprimerEscale($id: ID!) {
    supprimerEscale(id: $id)
  }
`;