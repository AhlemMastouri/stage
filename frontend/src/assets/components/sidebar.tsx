import { Link } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="sidebar">
      <h2>Gestion Des Anomalies</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/anomalies">Anomalies</Link>
        <Link to="/typeanomalie">Types Anomalie</Link>
        <Link to="/personnel">Personnels</Link>
        <Link to="/avions">Avions</Link>
        <Link to="/vols">Vols</Link>
        <Link to="/escales">Escales</Link>
        <button 
        onClick={handleLogout} 

      >
        Déconnexion
      </button>
      </nav>
    </div>
  );
}
