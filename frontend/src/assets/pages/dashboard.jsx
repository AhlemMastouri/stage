import { useQuery, gql } from "@apollo/client";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

const GET_ANOMALIES = gql`
  query {
    anomalies {
      id
      cause
      statut
      date_creation
      type_anomalie {
        description
      }
      avion {
        modele
      }
      vol {
        numero_vol
      }
    }
  }
`;

const COLORS = ["#28a745", "#ffc107", "#dc3545", "#007bff", "#6f42c1", "#17a2b8", "#fd7e14", "#20c997", "#e83e8c"];

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_ANOMALIES);

  if (loading) return <p style={{textAlign:"center", marginTop:"50px"}}>Chargement...</p>;
  if (error) return <p style={{color:"red", textAlign:"center", marginTop:"50px"}}>Erreur: {error.message}</p>;

  const anomalies = data.anomalies;

  // 1. Répartition par statut
  const countByStatut = {};
  anomalies.forEach((a) => {
    countByStatut[a.statut] = (countByStatut[a.statut] || 0) + 1;
  });
  const statsStatut = Object.keys(countByStatut).map((key) => ({
    name: key,
    value: countByStatut[key],
  }));

  // 2. Répartition par type d’anomalie
  const countByType = {};
  anomalies.forEach((a) => {
    const type = a.type_anomalie?.description || "Inconnu";
    countByType[type] = (countByType[type] || 0) + 1;
  });
  const statsType = Object.keys(countByType).map((key) => ({
    name: key,
    value: countByType[key],
  }));

  // 3. Evolution par mois (avec date valide et tri chronologique)
  const countByMonthMap = new Map();
  anomalies.forEach((a) => {
    const date = new Date(a.date_creation);
    if (isNaN(date)) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${month}`;
    if (!countByMonthMap.has(key)) {
      countByMonthMap.set(key, { value: 0, date });
    }
    countByMonthMap.get(key).value++;
  });
  const statsMois = Array.from(countByMonthMap.entries())
    .sort((a, b) => a[1].date - b[1].date)
    .map(([key, { value, date }]) => ({
      name: date.toLocaleString("fr-FR", { month: "short", year: "numeric" }),
      value
    }));

  // 4. Répartition par modèle avion
  const countByAvion = {};
  anomalies.forEach((a) => {
    const modele = a.avion?.modele || "Inconnu";
    countByAvion[modele] = (countByAvion[modele] || 0) + 1;
  });
  const statsAvion = Object.keys(countByAvion).map((key) => ({
    name: key,
    value: countByAvion[key],
  }));

  // 5. Répartition par vol
  const countByVol = {};
  anomalies.forEach((a) => {
    const vol = a.vol?.numero_vol || "Sans vol";
    countByVol[vol] = (countByVol[vol] || 0) + 1;
  });
  const statsVol = Object.keys(countByVol).map((key) => ({
    subject: key,
    A: countByVol[key],
  }));

  // 6. Répartition par cause (nouveau)
  const countByCause = {};
  anomalies.forEach((a) => {
    const cause = a.cause || "Inconnue";
    countByCause[cause] = (countByCause[cause] || 0) + 1;
  });
  const statsCause = Object.keys(countByCause).map((key) => ({
    name: key,
    value: countByCause[key],
  }));

  // 7. Répartition par année (nouveau)
  const countByYear = {};
  anomalies.forEach((a) => {
    const date = new Date(a.date_creation);
    if (isNaN(date)) return;
    const year = date.getFullYear();
    countByYear[year] = (countByYear[year] || 0) + 1;
  });
  const statsYear = Object.keys(countByYear).map((key) => ({
    name: key,
    value: countByYear[key],
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <header style={{
        position: "sticky",
        top: 0,
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "15px 20px",
        fontSize: "1.8rem",
        fontWeight: "700",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 1000,
        borderRadius: "0 0 10px 10px",
        textAlign: "center",
        marginBottom: 30
      }}>
        📊 Tableau de bord des anomalies
      </header>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        justifyContent: "center",
        maxWidth: 1200,
        margin: "0 auto"
      }}>

        {/* 1. PieChart - Statut */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition par statut</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statsStatut} dataKey="value" outerRadius={100} label>
                {statsStatut.map((entry, index) => (
                  <Cell key={`cell-statut-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. BarChart - Type d’anomalie */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition par type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

    

        {/* 4. AreaChart - Modèle avion */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition par modèle d’avion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statsAvion}>
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="value" stroke="#6f42c1" fill="#6f42c1" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 5. RadarChart - Par vol */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition par vol</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={statsVol} outerRadius={120}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Anomalies" dataKey="A" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 6. BarChart - Répartition par cause */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition par cause</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsCause}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" fill="#20c997" />
            </BarChart>
          </ResponsiveContainer>
        </div>

    
      </div>
    </div>
  );
}

// Styles communs pour les "cards" et titres
const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: 20,
  flex: "1 1 450px",
  minWidth: 350
};

const titleStyle = {
  textAlign: "center",
  marginBottom: 15
};
