import React, { useState } from "react";
import LoginForm from "./assets/pages/login";
import App1 from "./App1";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <App1 onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;

