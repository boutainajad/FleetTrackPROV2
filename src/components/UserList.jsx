import { useEffect, useState } from "react";
import { createUser, getUsers } from "../api";
import UserForm from "./UserForm";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getUsers({ signal: controller.signal }).then((items) => {
      setUsers(items); setLoading(false); setError("");
    }).catch((err) => {
      if (err.name !== "AbortError") { setError(err.message); setLoading(false); }
    });
    return () => controller.abort();
  }, [revision]);

  async function handleCreate(body) {
    await createUser(body);
    setShowForm(false);
    setLoading(true);
    setRevision((value) => value + 1);
  }

  const filtered = users.filter((user) => filter === "all" || user.role === filter);
  return <section>
    <h2>Utilisateurs</h2>
    <div className="filter-row">
      <button type="button" disabled={loading} onClick={() => { setLoading(true); setRevision((value) => value + 1); }}>Actualiser</button>
      <button type="button" onClick={() => setShowForm(!showForm)}>{showForm ? "Fermer" : "+ Nouvel utilisateur"}</button>
      <label htmlFor="user-filter">Role</label>
      <select id="user-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tous</option>
        <option value="admin">Admin</option>
        <option value="chauffeur">Chauffeur</option>
      </select>
    </div>
    {showForm && <UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
    {loading && <p role="status">Chargement...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && <>
      <p>{filtered.length} resultat(s)</p>
      {!filtered.length && <p>Aucun utilisateur.</p>}
      <ul className="item-list">{filtered.map((user) => <li key={user._id} className="item">
        <div><strong>{user.nom}</strong><p>{user.email}</p></div>
        <span className="role-badge">{user.role}</span>
        <span>{user.statut}</span>
      </li>)}</ul>
    </>}
  </section>;
}
