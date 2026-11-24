import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTrips } from "../api";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getMyTrips({ signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setTrips(items);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return <section>
    <h2>Mes trajets</h2>
    {loading && <p role="status">Chargement...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && !trips.length && <p>Aucun trajet ne vous est assigné.</p>}
    <ul className="item-list">
      {trips.map((trip) => <li key={trip._id} className="item">
        <Link to={`/chauffeur/trajets/${encodeURIComponent(trip._id)}`}>
          {trip.siteDepart} → {trip.siteArrivee}
        </Link>
        <span className="role-badge">{trip.statut}</span>
      </li>)}
    </ul>
  </section>;
}
