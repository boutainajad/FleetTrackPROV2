import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTripById } from "../api";

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!trip) return null;

  return (
    <div className="detail-panel">
      <h2>Detail du trajet</h2>
      <p>ID : {trip.id}</p>
      <p>Depart : {trip.departure}</p>
      <p>Arrivee : {trip.arrival}</p>
      <p>Statut : {trip.status}</p>
      <p>Chauffeur ID : {trip.driverId}</p>
      <p>Camion ID : {trip.truckId}</p>
      <p>Remorque ID : {trip.trailerId}</p>
      
      <Link to="/admin/trajets" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        Retour a la liste
      </Link>
    </div>
  );
}