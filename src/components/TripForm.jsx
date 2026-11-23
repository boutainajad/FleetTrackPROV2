import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getTrucks, getTrailers, createTrip } from "../api";

export default function TripForm() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [driverId, setDriverId] = useState("");
  const [truckId, setTruckId] = useState("");
  const [trailerId, setTrailerId] = useState("");
  
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then((data) => setDrivers(data.filter((u) => u.role === "DRIVER")));
    getTrucks().then((data) => setTrucks(data.filter((t) => t.status === "AVAILABLE")));
    getTrailers().then((data) => setTrailers(data.filter((t) => t.status === "AVAILABLE")));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!departure || !arrival || !driverId || !truckId || !trailerId) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await createTrip({ 
        departure, arrival, 
        driverId: Number(driverId), 
        truckId: Number(truckId), 
        trailerId: Number(trailerId) 
      });
      navigate("/admin/trajets");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="user-form">
      <h3>Nouveau Trajet</h3>
      <form onSubmit={handleSubmit}>
        <label>Depart</label>
        <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} />

        <label>Arrivee</label>
        <input type="text" value={arrival} onChange={(e) => setArrival(e.target.value)} />

        <label>Chauffeur</label>
        <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
          <option value="">-- Choisir un chauffeur --</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.username}</option>
          ))}
        </select>

        <label>Camion</label>
        <select value={truckId} onChange={(e) => setTruckId(e.target.value)}>
          <option value="">-- Choisir un camion --</option>
          {trucks.map((t) => (
            <option key={t.id} value={t.id}>{t.plateNumber}</option>
          ))}
        </select>

        <label>Remorque</label>
        <select value={trailerId} onChange={(e) => setTrailerId(e.target.value)}>
          <option value="">-- Choisir une remorque --</option>
          {trailers.map((t) => (
            <option key={t.id} value={t.id}>{t.plateNumber}</option>
          ))}
        </select>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Creation..." : "Creer le trajet"}
          </button>
          <button type="button" onClick={() => navigate("/admin/trajets")} disabled={submitting}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}