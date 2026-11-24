import { useState } from "react";

export default function LoginForm({ onLogin, loading = false, error = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(event) {
    event.preventDefault();
    if (!loading && email.trim() && password) onLogin(email.trim(), password);
  }
  return <div className="login-page">
    <form className="login-card" onSubmit={submit} aria-busy={loading}>
      <h1>FleetTrackPRO</h1>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="username" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Mot de passe</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
    </form>
  </div>;
}
