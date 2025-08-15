import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./dashboard.css";

const GET_TYPES_ANOMALIES = gql`
  query TypesAnomalie($search: String) {
    typesAnomalie(search: $search) {
      id
      code
      description
      categorie
    }
  }
`;

const CREER_TYPE_ANOMALIE = gql`
  mutation CreerTypeAnomalie($typeAnomalieInput: TypeAnomalieInput!) {
    creerTypeAnomalie(typeAnomalieInput: $typeAnomalieInput) {
      id
      code
      description
      categorie
    }
  }
`;

export default function TypeAnomaliePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    categorie: "",
  });

  const { loading, error, data, refetch } = useQuery(GET_TYPES_ANOMALIES, {
    variables: { search: "" },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only", // pour forcer la requête réseau à chaque fois
  });

  const [creerTypeAnomalie] = useMutation(CREER_TYPE_ANOMALIE);

  const handleSearch = async () => {
    try {
      await refetch({ search: searchTerm });
    } catch (err) {
      console.error("Erreur refetch :", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await creerTypeAnomalie({
        variables: { typeAnomalieInput: formData },
      });
      await refetch({ search: searchTerm });
      setFormData({ code: "", description: "", categorie: "" });
      setShowForm(false);
      alert("Type d'anomalie ajouté avec succès !");
    } catch (err) {
      alert("Erreur lors de l'ajout : " + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div className="page-container">
      <h2>La liste des Types d'Anomalies</h2>
  
      <div className="search-bar">
        <input
          type="text"
          placeholder="Recherche par code, description ou catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button className="btn" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Catégorie</th>
          </tr>
        </thead>
        <tbody>
          {data?.typesAnomalie?.length > 0 ? (
            data.typesAnomalie.map((type) => (
              <tr key={type.id}>
                <td>{type.code}</td>
                <td>{type.description}</td>
                <td>{type.categorie}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Aucun type d'anomalie trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Ajouter un type d'anomalie
        </button>
      )}

      {showForm && (
        <div className="form-container">
          <h3>Ajouter un nouveau type d'anomalie</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Code :
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </label>

            <label>
              Description :
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </label>

            <label>
              Catégorie :
              <input
                type="text"
                value={formData.categorie}
                onChange={(e) =>
                  setFormData({ ...formData, categorie: e.target.value })
                }
                required
              />
            </label>

            <div className="form-buttons">
              <button type="submit" className="submitButton">
                Ajouter
              </button>
              <button
                type="button"
                className="cancelButton"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
