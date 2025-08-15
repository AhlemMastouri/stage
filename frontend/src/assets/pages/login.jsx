import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./dashboard.css";
import tunisairLogo from "../../assets/TunisAir_logo-1024x204.png"; // ou .jpg selon le format

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem("token", data.login.token);
      onLogin();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setSuccess(false);
      alert("Échec de la connexion");
    }
  };

  return (
    <div className="login-container">
    <img
  className="login-logo"
  src={tunisairLogo}
  alt="Tunisair Logo"
/>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {error && <p className="login-error">Erreur de connexion</p>}
        {success && <p className="login-success">Connecté avec succès !</p>}
      </form>
    </div>
  );
}
