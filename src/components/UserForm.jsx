import { useState } from "react";

export default function UserForm({ onSubmit, onCancel }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("chauffeur");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ nom: nom.trim(), email: email.trim().toLowerCase(), password, role });
      setNom(""); setEmail(""); setPassword(""); setRole("chauffeur");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="user-form" onSubmit={submit} aria-busy={submitting}>
    <h3>Nouvel utilisateur</h3>
    <label htmlFor="new-nom">Nom complet</label>
    <input id="new-nom" name="nom" autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} minLength={2} maxLength={50} required disabled={submitting} />
    <label htmlFor="new-email">Email</label>
    <input id="new-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={submitting} />
    <label htmlFor="new-password">Mot de passe</label>
    <input id="new-password" name="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required disabled={submitting} />
    <label htmlFor="new-role">Role</label>
    <select id="new-role" name="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={submitting}>
      <option value="chauffeur">Chauffeur</option>
      <option value="admin">Admin</option>
    </select>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="form-actions">
      <button type="submit" disabled={submitting}>{submitting ? "Creation..." : "Creer"}</button>
      <button type="button" disabled={submitting} onClick={onCancel}>Annuler</button>
    </div>
  </form>;
}
