import { useState } from "react";
import { getUsers, createUser } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const newUser = await createUser({
        username: "new_driver_" + Date.now(),
        password: "pass123",
        role: "DRIVER",
      });
      setUsers([...users, newUser]);
    } catch (e) {
      setError(e.message);
    }
  }

  const filtered = users.filter((u) => {
    if (filter === "ALL") return true;
    return u.role === filter;
  });

  return (
    <div>
      <h2> Utilisateurs</h2>
      <div className="filter-row">
        <button onClick={load}>Charger</button>
        <button onClick={handleCreate}>+ Nouveau chauffeur</button>
        <label>Filtre :</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="ADMIN">Admin</option>
          <option value="DRIVER">Chauffeur</option>
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}
      {filtered.length === 0 && !loading && <p>Aucun utilisateur</p>}

      <ul className="item-list">
        {filtered.map((u) => (
          <li
            key={u.id}
            className={selected?.id === u.id ? "item selected" : "item"}
            onClick={() => setSelected(u)}
          >
            <strong>{u.username}</strong>
            <span className="role-badge">{u.role}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="detail-panel">
          <h3>Détail</h3>
          <p>ID : {selected.id}</p>
          <p>Username : {selected.username}</p>
          <p>Rôle : {selected.role}</p>
          <p>Actif : {selected.active ? "Oui" : "Non"}</p>
          <button onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
}