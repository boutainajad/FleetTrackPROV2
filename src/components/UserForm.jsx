import { useState } from "react";

export default function UserForm({ onSubmit, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DRIVER");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ username, password, role });
      setUsername("");
      setPassword("");
      setRole("DRIVER");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>Nouvel utilisateur</h3>

      <label htmlFor="new-username">Identifiant</label>
      <input
        id="new-username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={submitting}
      />

      <label htmlFor="new-password">Mot de passe</label>
      <input
        id="new-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
      />

      <label htmlFor="new-role">Role</label>
      <select
        id="new-role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={submitting}
      >
        <option value="DRIVER">Chauffeur</option>
        <option value="ADMIN">Admin</option>
      </select>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Creation..." : "Creer"}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Annuler
        </button>
      </div>
    </form>
  );
}