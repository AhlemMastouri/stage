import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";

// === Types ===
interface Personnel {
  id: string;
  nom: string;
  email: string;
}

interface TypeAnomalie {
  id: string;
  code: string;
  description: string;
  categorie?: string;
}

interface Avion {
  id: string;
  immatriculation: string;
  modele: string;
}

interface Vol {
  id: string;
  numero_vol: string;
}

interface Escale {
  id: string;
  code: string;
  nom: string;
  ville?: string;
}

interface Anomalie {
  id: string;
  cause: string;
  consequences?: string;
  statut: string;
  date_creation: string;
  type_anomalie?: TypeAnomalie;
  avion?: Avion;
  vol?: Vol;
  escale?: Escale;
  actions_prises: string;
  personnes_a_informer?: Personnel[];
}

interface AnomalieInput {
  type_anomalie: string;
  cause: string;
  avion?: string;
  vol?: string;
  escale?: string;
  consequences?: string;
  actions_prises: string;
  personnes_a_informer?: string[];
  statut?: string;
}

// === GraphQL ===
const GET_ANOMALIES = gql`
  query GetAnomalies {
    anomalies {
      id
      cause
      consequences
      statut
      date_creation
      actions_prises
      type_anomalie {
        id
        code
        description
      }
      avion {
        id
        immatriculation
        modele
      }
      vol {
        id
        numero_vol
      }
      escale {
        id
        code
        nom
        ville
      }
      personnes_a_informer {
        id
        nom
        email
      }
    }
  }
`;

const GET_RELATED_DATA = gql`
  query GetRelatedData {
    typesAnomalie {
      id
      code
      description
    }
    avions {
      id
      immatriculation
      modele
    }
    vols {
      id
      numero_vol
    }
    escales {
      id
      code
      nom
      ville
    }
    personnels {
      id
      nom
      email
    }
  }
`;

const CREER_ANOMALIE = gql`
  mutation CreerAnomalie($anomalieInput: AnomalieInput!) {
    creerAnomalie(anomalieInput: $anomalieInput) {
      id
      cause
      statut
    }
  }
`;

const CHANGER_STATUT = gql`
  mutation ChangerStatut($id: ID!, $statut: String!) {
    changerStatutAnomalie(id: $id, statut: $statut) {
      id
      statut
    }
  }
`;

export default function AnomaliePage() {
  const { loading, error, data, refetch } = useQuery<{ anomalies: Anomalie[] }>(GET_ANOMALIES);
  const {
    data: relatedData,
    loading: loadingRelated,
    error: errorRelated,
  } = useQuery(GET_RELATED_DATA);

  const [creerAnomalie] = useMutation(CREER_ANOMALIE);
  const [changerStatut] = useMutation(CHANGER_STATUT);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<AnomalieInput>({
    type_anomalie: "",
    cause: "",
    avion: "",
    vol: "",
    escale: "",
    consequences: "",
    actions_prises: "",
    personnes_a_informer: [],
  });

  if (loading || loadingRelated) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (errorRelated) return <div>Erreur chargement données liées</div>;

  const resetForm = () => {
    setFormData({
      type_anomalie: "",
      cause: "",
      avion: "",
      vol: "",
      escale: "",
      consequences: "",
      actions_prises: "",
      personnes_a_informer: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // S'assurer que actions_prises est une string avant mutation
    let actionsPrisesClean = formData.actions_prises;
    if (Array.isArray(actionsPrisesClean)) {
      actionsPrisesClean = actionsPrisesClean.join("\n");
    }

    try {
      await creerAnomalie({
        variables: {
          anomalieInput: {
            ...formData,
            actions_prises: actionsPrisesClean,
            statut: "ouvert",
          },
        },
        onCompleted: () => {
          refetch();
          setShowModal(false);
          resetForm();
        },
      });
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleChangeStatut = async (id: string, currentStatut: string) => {
    const newStatut = currentStatut === "ouvert" ? "fermé" : "ouvert";
    try {
      await changerStatut({
        variables: { id, statut: newStatut },
        onCompleted: () => refetch(),
      });
    } catch (err: any) {
      alert(`Erreur changement statut: ${err.message}`);
    }
  };

  const anomaliesFiltrees =
    data?.anomalies.filter((a) =>
      `${a.cause} ${a.type_anomalie?.description} ${a.avion?.immatriculation} ${a.vol?.numero_vol} ${a.escale?.nom}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="page-container">
      <h2> La liste des Anomalies</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={() => setShowModal(true)}>
          ➕ Ajouter une anomalie
        </button>
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>➕ Nouvelle Anomalie</h2>
            <form onSubmit={handleSubmit}>
              {/* Type */}
              <div className="formGroup">
                <label>Type d'anomalie</label>
                <select
                  value={formData.type_anomalie}
                  onChange={(e) => setFormData({ ...formData, type_anomalie: e.target.value })}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {relatedData?.typesAnomalie.map((t: TypeAnomalie) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cause */}
              <div className="formGroup">
                <label>Cause</label>
                <textarea
                  value={formData.cause}
                  onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                  required
                />
              </div>

              {/* Avion */}
              <div className="formGroup">
                <label>Avion</label>
                <select
                  value={formData.avion}
                  onChange={(e) => setFormData({ ...formData, avion: e.target.value })}
                >
                  <option value="">-- Aucun --</option>
                  {relatedData?.avions.map((av: Avion) => (
                    <option key={av.id} value={av.id}>
                      {av.immatriculation} - {av.modele}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vol */}
              <div className="formGroup">
                <label>Vol</label>
                <select
                  value={formData.vol}
                  onChange={(e) => setFormData({ ...formData, vol: e.target.value })}
                >
                  <option value="">-- Aucun --</option>
                  {relatedData?.vols.map((v: Vol) => (
                    <option key={v.id} value={v.id}>
                      {v.numero_vol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Escale */}
              <div className="formGroup">
                <label>Escale</label>
                <select
                  value={formData.escale}
                  onChange={(e) => setFormData({ ...formData, escale: e.target.value })}
                >
                  <option value="">-- Aucune --</option>
                  {relatedData?.escales.map((es: Escale) => (
                    <option key={es.id} value={es.id}>
                      {es.code} - {es.nom} {es.ville && `(${es.ville})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conséquences */}
              <div className="formGroup">
                <label>Conséquences</label>
                <textarea
                  value={formData.consequences}
                  onChange={(e) => setFormData({ ...formData, consequences: e.target.value })}
                />
              </div>

              {/* Actions prises */}
              <div className="formGroup">
                <label>Actions prises</label>
                <textarea
                  value={formData.actions_prises}
                  onChange={(e) => setFormData({ ...formData, actions_prises: e.target.value })}
                  required
                />
              </div>

              {/* Personnes à informer */}
              <div className="formGroup">
                <label>Personnes à informer</label>
                <select
                  multiple
                  value={formData.personnes_a_informer}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, (o) => o.value);
                    setFormData({ ...formData, personnes_a_informer: options });
                  }}
                >
                  {relatedData?.personnels.map((p: Personnel) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modalActions">
                <button type="submit" className="submitButton">✅ Enregistrer</button>
                <button type="button" className="cancelButton" onClick={() => setShowModal(false)}>
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLE --- */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Cause</th>
            <th>Avion</th>
            <th>Vol</th>
            <th>Escale</th>
            <th>Actions</th>
            <th>Statut</th>
            <th>Personne à informer </th>
            <th>Changer statut</th>
          </tr>
        </thead>
      <tbody>
  {anomaliesFiltrees.length > 0 ? (
    anomaliesFiltrees.map((a) => (
      <tr key={a.id}>
        <td>{a.type_anomalie?.description || "—"}</td>
        <td>{a.cause || "—"}</td>
        <td>{a.avion?.immatriculation || "—"}</td>
        <td>{a.vol?.numero_vol || "—"}</td>
        <td>{a.escale?.nom || "—"}</td>
        <td>{a.actions_prises || "—"}</td>
        <td>{a.statut || "—"}</td>
        {/* Ici, on affiche les personnes à informer au lieu de la date */}
        <td>
          {a.personnes_a_informer && a.personnes_a_informer.length > 0
            ? a.personnes_a_informer.map(p => p.nom).join(", ")
            : "—"
          }
        </td>
        <td>
          <button
            className="statusButton"
            onClick={() => handleChangeStatut(a.id, a.statut)}
          >
            🔄 {a.statut === "ouvert" ? "Fermer" : "Ouvrir"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={9} style={{ textAlign: "center", fontStyle: "italic" }}>
        Aucune anomalie trouvée
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}
