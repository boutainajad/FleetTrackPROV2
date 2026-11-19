import { useState } from "react";

export default function TruckForm({ initialData, onSubmit, onCancel }) {
  const [plateNumber, setPlateNumber] = useState(initialData?.plateNumber || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [status, setStatus] = useState(initialData?.status || "AVAILABLE");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!plateNumber || !brand) {
      setError("L'immatriculation et la marque sont obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ plateNumber, brand, status });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Modifier le camion" : "Nouveau camion"}</h3>

      <label>Immatriculation</label>
      <input
        type="text"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
        disabled={submitting}
      />

      <label>Marque</label>
      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        disabled={submitting}
      />

      <label>Statut</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={submitting}
      >
        <option value="AVAILABLE">Disponible</option>
        <option value="MAINTENANCE">Maintenance</option>
      </select>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Annuler
        </button>
      </div>
    </form>
  );
}