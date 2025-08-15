import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import "./dashboard.css";

type Personnel = {
  id: string;
  matricule: string;
  nom: string;
  email: string;
  service: string;
  role: string;
};

const GET_PERSONNELS = gql`
  query GetPersonnels {
    personnels {
      id
      matricule
      nom
      email
      service
      role
    }
  }
`;

const CREER_PERSONNEL = gql`
  mutation CreerPersonnel($personnelInput: PersonnelInput!) {
    creerPersonnel(personnelInput: $personnelInput) {
      id
      matricule
      nom
      email
      service
      role
    }
  }
`;

export default function PersonnelPage() {
  const { loading, error, data, refetch } = useQuery<{ personnels: Personnel[] }>(GET_PERSONNELS);
  const [creerPersonnel] = useMutation(CREER_PERSONNEL);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    email: "",
    service: "",
    role: "technicien",
    mot_de_passe: "",
  });

  const resetForm = () => {
    setFormData({
      matricule: "",
      nom: "",
      email: "",
      service: "",
      role: "technicien",
      mot_de_passe: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const personnelInput = {
        matricule: formData.matricule,
        nom: formData.nom,
        email: formData.email,
        service: formData.service,
        role: formData.role,
        mot_de_passe: formData.mot_de_passe,
      };

      await creerPersonnel({
        variables: { personnelInput },
      });

      await refetch();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(`Erreur lors de la création: ${err.message}`);
    }
  };

  const personnelsFiltres =
    data?.personnels?.filter((p) =>
      `${p.matricule} ${p.nom} ${p.email} ${p.service} ${p.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  if (loading)
    return <div className="loading">Chargement en cours...</div>;
  if (error)
    return <div className="error">Erreur: {error.message}</div>;

  return (
    <div className="page-container">
      <h2>La liste des personnels</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={() => setShowModal(true)}>
          ➕ Ajouter un personnel
        </button>
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>➕ Nouveau Personnel</h2>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label>Matricule</label>
                <input
                  type="text"
                  placeholder="Matricule"
                  value={formData.matricule}
                  onChange={(e) =>
                    setFormData({ ...formData, matricule: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label>Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label>Service</label>
                <input
                  type="text"
                  placeholder="Service"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label>Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="technicien">Technicien</option>
                  <option value="responsable">Responsable</option>
                  <option value="administrateur">Administrateur</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={formData.mot_de_passe}
                  onChange={(e) =>
                    setFormData({ ...formData, mot_de_passe: e.target.value })
                  }
                  required
                  minLength={6}
                />
              </div>

              <div className="modalActions">
                <button type="submit" className="submitButton">
                  ✅ Enregistrer
                </button>
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setShowModal(false)}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Service</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {personnelsFiltres.length > 0 ? (
            personnelsFiltres.map((p) => (
              <tr key={p.id}>
                <td>{p.matricule}</td>
                <td>{p.nom}</td>
                <td>{p.email}</td>
                <td>{p.service}</td>
                <td>{p.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="noData">
                Aucun personnel trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
