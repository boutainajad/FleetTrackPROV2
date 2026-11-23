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

  async function handleAdvanceStatus() {
    setUpdating(true);
    setError("");
    
    let nextStatus = "PLANNED";
    if (trip.status === "PLANNED") nextStatus = "IN_PROGRESS";
    else if (trip.status === "IN_PROGRESS") nextStatus = "COMPLETED";

    try {
      const updated = await updateTripStatus(trip.id, nextStatus);
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
      <p>ID : {trip.id}</p>
      <p>Depart : {trip.departure}</p>
      <p>Arrivee : {trip.arrival}</p>
      <p>Statut : <strong>{trip.status}</strong></p>
      
      {error && <p className="error">{error}</p>}

      <div className="form-actions" style={{ marginTop: '20px' }}>
        {trip.status !== "COMPLETED" && (
          <button onClick={handleAdvanceStatus} disabled={updating}>
            {updating ? "Mise a jour..." : "Avancer le statut"}
          </button>
        )}
        <Link to="/chauffeur/trajets" style={{ textDecoration: 'none', padding: '10px', background: '#999', color: 'white', borderRadius: '4px' }}>
          Retour
        </Link>
      </div>
    </div>
  );
}