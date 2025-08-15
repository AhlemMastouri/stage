import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./dashboard.css";

const GET_ESCALES = gql`
  query {
    escales {
      id
      code
      nom
      ville
      pays
      est_aeroport_principal
    }
  }
`;

const UPDATE_ESCALE = gql`
  mutation UpdateEscale($id: ID!, $escaleInput: EscaleInput!) {
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

export default function Escales() {
  const { loading, error, data, refetch } = useQuery(GET_ESCALES);
  const [updateEscale] = useMutation(UPDATE_ESCALE);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    ville: "",
    pays: "",
    est_aeroport_principal: false,
  });

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEscale, setFilteredEscale] = useState(null);

  if (loading) return <p>Chargement des escales...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const startEdit = (escale) => {
    setEditingId(escale.id);
    setFormData({
      code: escale.code,
      nom: escale.nom,
      ville: escale.ville,
      pays: escale.pays,
      est_aeroport_principal: escale.est_aeroport_principal,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      code: "",
      nom: "",
      ville: "",
      pays: "",
      est_aeroport_principal: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEscale({
        variables: {
          id: editingId,
          escaleInput: {
            code: formData.code,
            nom: formData.nom,
            ville: formData.ville,
            pays: formData.pays,
            est_aeroport_principal: formData.est_aeroport_principal,
          },
        },
      });
      cancelEdit();
      refetch();
      setFilteredEscale(null);
      setSearchTerm("");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredEscale(null);
    } else {
      const result = data.escales.filter(
        (escale) =>
          escale.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          escale.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          escale.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          escale.pays.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEscale(result);
    }
  };

  // La liste à afficher : filtrée ou complète
  const escalesToDisplay = filteredEscale !== null ? filteredEscale : data.escales;

  return (
    <div className="page-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par code, nom, ville ou pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="btn btn-search" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      <h2>Liste des Escales</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Ville</th>
            <th>Pays</th>
            <th>Aéroport principal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {escalesToDisplay.length > 0 ? (
            escalesToDisplay.map((escale) => (
              <tr key={escale.id}>
                <td>{escale.code}</td>
                <td>{escale.nom}</td>
                <td>{escale.ville}</td>
                <td>{escale.pays}</td>
                <td>{escale.est_aeroport_principal ? "Oui" : "Non"}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(escale)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Aucune escale trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingId && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Modifier Escale</h3>
          <label>
            Code :
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nom :
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ville :
            <input
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Pays :
            <input
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Est un aéroport principal :
            <input
              type="checkbox"
              name="est_aeroport_principal"
              checked={formData.est_aeroport_principal}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button type="submit" className="btn btn-edit">
              Enregistrer
            </button>
            <button type="button" className="btn btn-cancel" onClick={cancelEdit}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
