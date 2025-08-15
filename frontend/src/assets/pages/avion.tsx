import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import styles from "./avion.module.css";

type Avion = {
  id: string;
  immatriculation: string;
  modele: string;
  configuration: string;
  date_mise_en_service: string;
  statut: string;
};

// === QUERIES ===
const GET_AVIONS = gql`
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

// Mutation pour créer un avion
const CREER_AVION = gql`
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

// Mutation pour changer le statut d'un avion
const MODIFIER_STATUT_AVION = gql`
  mutation ModifierStatutAvion($id: ID!, $statut: String!) {
    modifierStatutAvion(id: $id, statut: $statut) {
      id
      statut
    }
  }
`;

export default function AvionPage() {
  const { loading, error, data, refetch } = useQuery<{ avions: Avion[] }>(GET_AVIONS);
  const [creerAvion] = useMutation(CREER_AVION);
  const [modifierStatutAvion] = useMutation(MODIFIER_STATUT_AVION);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    immatriculation: "",
    modele: "",
    configuration: "",
    date_mise_en_service: "",
    statut: "en_service",
  });

  if (loading) return <div className={styles.loading}>Chargement en cours...</div>;
  if (error) return <div className={styles.error}>Erreur: {error.message}</div>;

  const resetForm = () => {
    setFormData({
      immatriculation: "",
      modele: "",
      configuration: "",
      date_mise_en_service: "",
      statut: "en_service",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const avionInput = {
        immatriculation: formData.immatriculation,
        modele: formData.modele,
        configuration: formData.configuration,
        date_mise_en_service: formData.date_mise_en_service,
        statut: formData.statut,
      };

      await creerAvion({
        variables: { avionInput },
      });

      await refetch();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      alert(`Erreur lors de la création: ${err.message}`);
    }
  };

  const handleChangeStatut = async (id: string, currentStatut: string) => {
    // Cycle des statuts
    const statuts = ["en_service", "maintenance", "hors_service"];
    const currentIndex = statuts.indexOf(currentStatut);
    const nextStatut = statuts[(currentIndex + 1) % statuts.length];

    try {
      await modifierStatutAvion({
        variables: { id, statut: nextStatut },
      });
      await refetch();
    } catch (err: any) {
      console.error("Erreur changement statut:", err);
      alert(`Erreur lors du changement de statut : ${err.message}`);
    }
  };

  const avionsFiltres =
    data?.avions?.filter((a) =>
      `${a.immatriculation} ${a.modele} ${a.configuration} ${a.date_mise_en_service} ${a.statut}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>La liste des Avions</h1>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          ➕ Ajouter un avion
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>➕ Nouvel Avion</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Immatriculation"
                value={formData.immatriculation}
                onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Modèle"
                value={formData.modele}
                onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Configuration"
                value={formData.configuration}
                onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                required
              />
              <input
                type="date"
                value={formData.date_mise_en_service}
                onChange={(e) => setFormData({ ...formData, date_mise_en_service: e.target.value })}
                required
              />
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                required
              >
                <option value="en_service">En service</option>
                <option value="maintenance">En maintenance</option>
                <option value="hors_service">Hors service</option>
              </select>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  ✅ Enregistrer
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Immatriculation</th>
            <th>Modèle</th>
            <th>Configuration</th>
            <th>Date mise en service</th>
            <th>Statut</th>
            <th>Changer statut</th>
          </tr>
        </thead>
        <tbody>
          {avionsFiltres.length > 0 ? (
            avionsFiltres.map((a) => (
              <tr key={a.id}>
                <td>{a.immatriculation}</td>
                <td>{a.modele}</td>
                <td>{a.configuration}</td>
               <td>
  {a.date_mise_en_service && !isNaN(Number(a.date_mise_en_service))
    ? new Date(Number(a.date_mise_en_service)).toLocaleDateString()
    : "Non définie"}
</td>

                <td>{a.statut}</td>
                <td>
                  <button
                    className={styles.btnEdit}
                    onClick={() => handleChangeStatut(a.id, a.statut)}
                    title="Changer le statut"
                  >
                    🔄
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noData}>
                Aucun avion trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
