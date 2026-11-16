import { useState } from "react";
import { getTrucks, createTruck } from "../api";

export default function TruckList() {
  const [trucks, setTrucks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getTrucks();
      setTrucks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const newTruck = await createTruck({
        plateNumber: "NEW-" + Date.now(),
        status: "AVAILABLE",
        brand: "Volvo",
      });
      setTrucks([...trucks, newTruck]);
    } catch (e) {
      setError(e.message);
    }
  }

  const filtered = trucks.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  return (
    <div>
      <h2> Camions</h2>
      <div className="filter-row">
        <button onClick={load}>Charger</button>
        <button onClick={handleCreate}>+ Nouveau camion</button>
        <label>Filtre :</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}
      {filtered.length === 0 && !loading && <p>Aucun camion</p>}

      <ul className="item-list">
        {filtered.map((t) => (
          <li
            key={t.id}
            className={selected?.id === t.id ? "item selected" : "item"}
            onClick={() => setSelected(t)}
          >
            <strong>{t.plateNumber}</strong>
            <span className="role-badge">{t.status}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="detail-panel">
          <h3>Détail camion</h3>
          <p>ID : {selected.id}</p>
          <p>Immatriculation : {selected.plateNumber}</p>
          <p>Marque : {selected.brand}</p>
          <p>Statut : {selected.status}</p>
          <button onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
}