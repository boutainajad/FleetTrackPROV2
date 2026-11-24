import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTripById, updateTripStatus } from "../api";

export default function MyTripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTripById(id)
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  async function handleChangeStatus(newStatus) {
    setUpdating(true);
    setError("");
    try {
      const updated = await updateTripStatus(trip._id, newStatus);
      setTrip(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error && !trip) return <p className="error">{error}</p>;
  if (!trip) return null;

  return (
    <div className="detail-panel">
      <h2>Detail du trajet</h2>
      <p>ID : {trip._id}</p>
      <p>{trip.depart} ➔ {trip.arrivee}</p>
      <p>Statut : <strong>{trip.statut}</strong></p>
      
      {error && <p className="error">{error}</p>}

      <div className="form-actions" style={{ marginTop: '20px' }}>
        {trip.statut === "planifie" && (
          <button onClick={() => handleChangeStatus("en_cours")} disabled={updating}>
            {updating ? "Démarrage..." : "Démarrer le trajet"}
          </button>
        )}

        {trip.statut === "en_cours" && (
          <button onClick={() => handleChangeStatus("termine")} disabled={updating} style={{ background: '#d9534f' }}>
            {updating ? "Clôture..." : "Finir le trajet"}
          </button>
        )}

        {trip.statut === "termine" && (
          <p style={{ color: "green", fontWeight: "bold" }}>Trajet terminé</p>
        )}
      </div>

      <Link to="/chauffeur/trajets" style={{ display: 'block', marginTop: '20px', color: '#0077ff' }}>
        Retour aux trajets
      </Link>
    </div>
  );
}