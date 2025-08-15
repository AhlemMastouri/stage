import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./dashboard.css";

// Types locaux
export interface Avion {
  id: string;
  immatriculation: string;
  modele: string;
  configuration?: string;
  date_mise_en_service?: string;
  statut?: string;
}

export interface Escale {
  id: string;
  code: string;
  nom: string;
  ville?: string;
}

export interface Vol {
  id: string;
  numero_vol: string;
  aeroport_depart?: Escale;
  aeroport_arrivee?: Escale;
  date_vol: any;
  heure_depart_prevue: string;
  heure_arrivee_prevue: string;
  avion_affecte?: Avion;
  statut: string;
}

// Requêtes GraphQL
const GET_VOLS = gql`
  query {
    vols {
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
    }
  }
`;

const GET_ESCALES = gql`
  query {
    escales {
      id
      code
      nom
    }
  }
`;

const GET_AVIONS = gql`
  query {
    avions {
      id
      immatriculation
      modele
    }
  }
`;

const UPDATE_VOL = gql`
  mutation UpdateVol($id: ID!, $volInput: VolInput!) {
    mettreAJourVol(id: $id, volInput: $volInput) {
      id
      numero_vol
      date_vol
      heure_depart_prevue
      heure_arrivee_prevue
      statut
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
      avion_affecte {
        id
        immatriculation
        modele
      }
    }
  }
`;

// Fonction formatDate corrigée
function formatDate(dateInput: any) {
  if (!dateInput) return "-";

  let date: Date;

  // Si c'est une chaîne de chiffres (timestamp en ms)
  if (typeof dateInput === "string" && /^\d+$/.test(dateInput)) {
    date = new Date(Number(dateInput));
  } else if (typeof dateInput === "string" || dateInput instanceof String) {
    date = new Date(dateInput as string);
  } else if (typeof dateInput === "number") {
    date = new Date(dateInput);
  } else if (dateInput._seconds) {
    date = new Date(dateInput._seconds * 1000);
  } else {
    return "Date invalide";
  }

  if (isNaN(date.getTime())) return "Date invalide";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("fr-FR", options);
}

export default function Vols() {
  const { loading, error, data } = useQuery(GET_VOLS);
  const { data: escalesData } = useQuery(GET_ESCALES);
  const { data: avionsData } = useQuery(GET_AVIONS);

  const [updateVol] = useMutation(UPDATE_VOL);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    numero_vol: "",
    aeroport_depart: "",
    aeroport_arrivee: "",
    date_vol: "",
    heure_depart_prevue: "",
    heure_arrivee_prevue: "",
    avion_affecte: "",
    statut: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (loading) return <p>Chargement des vols...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  // Pour debug, affiche les dates brutes
  console.log(
    "Dates brutes reçues :",
    data.vols.map((v: Vol) => v.date_vol)
  );

  // Filtrer les vols selon searchTerm
  const filteredVols = data.vols.filter((vol: Vol) => {
    const search = searchTerm.toLowerCase();

    return (
      vol.numero_vol?.toLowerCase().includes(search) ||
      vol.aeroport_depart?.code?.toLowerCase().includes(search) ||
      vol.aeroport_depart?.nom?.toLowerCase().includes(search) ||
      vol.aeroport_arrivee?.code?.toLowerCase().includes(search) ||
      vol.aeroport_arrivee?.nom?.toLowerCase().includes(search) ||
      (vol.date_vol?.toString().toLowerCase() || "").includes(search) ||
      vol.heure_depart_prevue?.toLowerCase().includes(search) ||
      vol.heure_arrivee_prevue?.toLowerCase().includes(search) ||
      vol.avion_affecte?.immatriculation?.toLowerCase().includes(search) ||
      vol.avion_affecte?.modele?.toLowerCase().includes(search) ||
      vol.statut?.toLowerCase().includes(search)
    );
  });

  const startEdit = (vol: Vol) => {
    setEditingId(vol.id);
    setSubmitError(null);
    setFormData({
      numero_vol: vol.numero_vol || "",
      aeroport_depart: vol.aeroport_depart?.id || "",
      aeroport_arrivee: vol.aeroport_arrivee?.id || "",
      date_vol:
        vol.date_vol && typeof vol.date_vol === "string" && /^\d+$/.test(vol.date_vol)
          ? new Date(Number(vol.date_vol)).toISOString().slice(0, 10)
          : vol.date_vol && typeof vol.date_vol === "string"
          ? vol.date_vol.slice(0, 10)
          : "",
      heure_depart_prevue: vol.heure_depart_prevue || "",
      heure_arrivee_prevue: vol.heure_arrivee_prevue || "",
      avion_affecte: vol.avion_affecte?.id || "",
      statut: vol.statut || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSubmitError(null);
    setFormData({
      numero_vol: "",
      aeroport_depart: "",
      aeroport_arrivee: "",
      date_vol: "",
      heure_depart_prevue: "",
      heure_arrivee_prevue: "",
      avion_affecte: "",
      statut: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    if (
      formData.aeroport_depart &&
      formData.aeroport_arrivee &&
      formData.aeroport_depart === formData.aeroport_arrivee
    ) {
      setSubmitError(
        "L'aéroport de départ et d'arrivée ne peuvent pas être identiques."
      );
      return;
    }

    try {
      await updateVol({
        variables: {
          id: editingId,
          volInput: {
            ...formData,
            aeroport_depart: formData.aeroport_depart || null,
            aeroport_arrivee: formData.aeroport_arrivee || null,
            avion_affecte: formData.avion_affecte || null,
          },
        },
        update(cache, { data: { mettreAJourVol } }) {
          const existingVols: any = cache.readQuery({ query: GET_VOLS });
          if (existingVols) {
            const newVols = existingVols.vols.map((v: Vol) =>
              v.id === mettreAJourVol.id ? mettreAJourVol : v
            );
            cache.writeQuery({
              query: GET_VOLS,
              data: { vols: newVols },
            });
          }
        },
      });
      cancelEdit();
    } catch (err) {
      console.error(err);
      setSubmitError("Erreur lors de la mise à jour du vol.");
    }
  };

  return (
    <div className="page-container">
      <h2>Liste des Vols</h2>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="search-bar"
        style={{ marginBottom: "1rem" }}
      >
        <input
          type="text"
          placeholder="Rechercher par n° vol, aéroport, date, avion, statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Réinitialiser
        </button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Départ</th>
            <th>Arrivée</th>
            <th>Date</th>
            <th>Heure départ</th>
            <th>Heure arrivée</th>
            <th>Avion</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVols.length > 0 ? (
            filteredVols.map((vol: Vol) => (
              <tr key={vol.id}>
                <td>{vol.numero_vol}</td>
                <td>{vol.aeroport_depart?.code || "-"}</td>
                <td>{vol.aeroport_arrivee?.code || "-"}</td>
                <td>{formatDate(vol.date_vol)}</td>
                <td>{vol.heure_depart_prevue}</td>
                <td>{vol.heure_arrivee_prevue}</td>
                <td>{vol.avion_affecte?.immatriculation || "-"}</td>
                <td>{vol.statut}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(vol)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                Aucun vol trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingId && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Modifier Vol</h3>

          {submitError && (
            <div
              className="error-message"
              role="alert"
              style={{ marginBottom: "1rem", color: "red" }}
            >
              {submitError}
            </div>
          )}

          <label>
            Numéro vol :
            <input
              name="numero_vol"
              value={formData.numero_vol}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Aéroport départ :
            <select
              name="aeroport_depart"
              value={formData.aeroport_depart}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner --</option>
              {escalesData?.escales.map((esc: Escale) => (
                <option key={esc.id} value={esc.id}>
                  {esc.code} - {esc.nom}
                </option>
              ))}
            </select>
          </label>

          <label>
            Aéroport arrivée :
            <select
              name="aeroport_arrivee"
              value={formData.aeroport_arrivee}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner --</option>
              {escalesData?.escales.map((esc: Escale) => (
                <option key={esc.id} value={esc.id}>
                  {esc.code} - {esc.nom}
                </option>
              ))}
            </select>
          </label>

          <label>
            Avion affecté :
            <select
              name="avion_affecte"
              value={formData.avion_affecte}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner --</option>
              {avionsData?.avions.map((av: Avion) => (
                <option key={av.id} value={av.id}>
                  {av.immatriculation} - {av.modele}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date vol :
            <input
              type="date"
              name="date_vol"
              value={formData.date_vol}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Heure départ :
            <input
              type="time"
              name="heure_depart_prevue"
              value={formData.heure_depart_prevue}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Heure arrivée :
            <input
              type="time"
              name="heure_arrivee_prevue"
              value={formData.heure_arrivee_prevue}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Statut :
            <input
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-buttons">
            <button type="submit" className="btn btn-edit">
              Enregistrer
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="btn btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
