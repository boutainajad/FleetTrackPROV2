import { useState } from "react";
import { getTrucks, createTruck, updateTruck, archiveTruck } from "../api";
import TruckForm from "./TruckForm";

export default function TruckList() {
  const [trucks, setTrucks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);

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

  async function handleCreate(formData) {
    try {
      const newTruck = await createTruck(formData);
      setTrucks([...trucks, newTruck]);
      setShowForm(false);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleUpdate(formData) {
    try {
      const updated = await updateTruck(editingTruck.id, formData);
      setTrucks(trucks.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTruck(null);
      setSelected(updated);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleArchive() {
    if (!window.confirm("Voulez-vous vraiment archiver ce camion ?")) return;
    try {
      await archiveTruck(selected.id);
      setTrucks(trucks.filter((t) => t.id !== selected.id));
      setSelected(null);
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
      <h2>Camions</h2>

      <div className="filter-row">
        <button onClick={load}>Charger</button>
        <button onClick={() => { setShowForm(true); setEditingTruck(null); }}>+ Nouveau</button>

        <label>Filtre :</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <span>{filtered.length} resultat(s)</span>
      </div>

      {showForm && (
        <TruckForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editingTruck && (
        <TruckForm
          initialData={editingTruck}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTruck(null)}
        />
      )}

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
          <h3>Detail camion</h3>
          <p>ID : {selected.id}</p>
          <p>Immatriculation : {selected.plateNumber}</p>
          <p>Marque : {selected.brand}</p>
          <p>Statut : {selected.status}</p>
          
          <div className="form-actions" style={{ marginTop: '15px' }}>
            <button onClick={() => setEditingTruck(selected)}>Modifier</button>
            <button onClick={handleArchive} style={{ background: '#d9534f' }}>Archiver</button>
            <button onClick={() => setSelected(null)} style={{ background: '#999' }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}