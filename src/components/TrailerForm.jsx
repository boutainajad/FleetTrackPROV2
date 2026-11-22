import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrailer } from "../api";

export default function TrailerForm() {
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!plateNumber || !capacity) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await createTrailer({ plateNumber, capacity: Number(capacity) });
      navigate("/admin/remorques");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="user-form">
      <h3>Nouvelle Remorque</h3>
      <form onSubmit={handleSubmit}>
        <label>Immatriculation</label>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          disabled={submitting}
        />

        <label>Capacité (tonnes)</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          disabled={submitting}
        />

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Création..." : "Créer"}
          </button>
          <button type="button" onClick={() => navigate("/admin/remorques")} disabled={submitting}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}