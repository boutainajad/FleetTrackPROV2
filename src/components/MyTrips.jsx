import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTrips, updateTripStatus } from "../api";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState([]);
  const pending = useRef(new Set());
  const activeRequest = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current = controller;
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

  async function changeStatus(trip) {
    if (pending.current.has(trip._id) || !["planifie", "en_cours"].includes(trip.statut)) return;
    const controller = activeRequest.current;
    pending.current.add(trip._id);
    setBusyIds([...pending.current]);
    setError("");
    try {
      const updated = await updateTripStatus(trip._id, trip.statut === "planifie" ? "en_cours" : "termine");
      if (!controller.signal.aborted) {
        setTrips((items) => items.map((item) => item._id === updated._id ? { ...item, ...updated } : item));
      }
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      pending.current.delete(trip._id);
      if (!controller.signal.aborted) setBusyIds([...pending.current]);
    }
  }

  return <section>
    <h2>Mes trajets</h2>
    {loading && <p role="status">Chargement...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && !trips.length && <p>Aucun trajet ne vous est assigné.</p>}
    <ul className="item-list">
      {trips.map((trip) => <li key={trip._id} className="item" style={{ padding: 0, gap: 12 }}>
        <Link
          to={`/chauffeur/trajets/${encodeURIComponent(trip._id)}`}
          aria-label={`Voir le trajet de ${trip.siteDepart} à ${trip.siteArrivee}`}
          style={{ display: "flex", flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 16, color: "inherit", textDecoration: "none", minWidth: 0 }}
        >
          <span>{trip.siteDepart} → {trip.siteArrivee}</span>
          <span className="role-badge">{trip.statut}</span>
        </Link>
        {trip.statut === "planifie" && <button
          type="button"
          disabled={busyIds.includes(trip._id)}
          onClick={() => changeStatus(trip)}
          style={{ marginRight: 16 }}
        >
          {busyIds.includes(trip._id) ? "Démarrage..." : "Démarrer le trajet"}
        </button>}
        {trip.statut === "en_cours" && <button
          type="button"
          disabled={busyIds.includes(trip._id)}
          onClick={() => changeStatus(trip)}
          style={{ marginRight: 16 }}
        >
          {busyIds.includes(trip._id) ? "Enregistrement..." : "Terminer le trajet"}
        </button>}
      </li>)}
    </ul>
  </section>;
}
