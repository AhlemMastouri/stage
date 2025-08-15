import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./assets/components/sidebar";
import Anomalie from "./assets/pages/anomalie";
import Personnls from "./assets/pages/personnel";
import Avions from "./assets/pages/avion";
import Types from "./assets/pages/typeanoamlie";
import Dashboard from "./assets/pages/dashboard";
import Vols from "./assets/pages/vol";
import Escales from "./assets/pages/escale";

export default function App1({ onLogout }) {
  return (
    <Router>
      <div className="app-container">
        <Sidebar onLogout={onLogout} />
        <div className="content">
          <Routes>
            <Route path="/anomalies" element={<Anomalie />} />
            <Route path="/personnel" element={<Personnls />} />
            <Route path="/typeanomalie" element={<Types />} />
            <Route path="/avions" element={<Avions />} />
            <Route path="/vols" element={<Vols />} />
            <Route path="/escales" element={<Escales />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
