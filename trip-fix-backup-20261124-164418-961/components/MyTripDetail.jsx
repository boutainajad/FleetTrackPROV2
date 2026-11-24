import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyTripById, updateTripStatus } from "../api";

export default function MyTripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const activeRequest = useRef(null);
  const submitting = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current = controller;
    submitting.current = false;
    setTrip(null);
    setError("");
    setLoading(true);
    setSaving(false);
    getMyTripById(id, { signal: controller.signal })
      .then((item) => {
        if (!controller.signal.aborted) setTrip(item);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  async function changeStatus() {
    if (submitting.current || !trip || !["planifie", "en_cours"].includes(trip.statut)) return;
    const controller = activeRequest.current;
    const starting = trip.statut === "planifie";
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      const updated = await updateTripStatus(trip._id, starting ? "en_cours" : "termine");
      if (!controller.signal.aborted) setTrip((current) => ({ ...current, ...updated }));
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      if (!controller.signal.aborted) {
        submitting.current = false;
        setSaving(false);
      }
    }
  }

  if (loading) return <p role="status">Chargement...</p>;

  return <section className="detail-panel">
    <h2>Détail du trajet</h2>
    {error && <p role="alert" className="error">{error}</p>}
    {trip && <>
      <p>ID : {trip._id}</p>
      <p>Départ : {trip.siteDepart}</p>
      <p>Arrivée : {trip.siteArrivee}</p>
      <p>Marchandise : {trip.marchandise}</p>
      <p>Statut : <strong>{trip.statut}</strong></p>
      {trip.kmDepart != null && <p>Kilométrage de départ : {trip.kmDepart} km</p>}
      {trip.kmArrivee != null && <p>Kilométrage d’arrivée : {trip.kmArrivee} km</p>}
      <div className="form-actions">
        {trip.statut === "planifie" && <button type="button" onClick={changeStatus} disabled={saving}>
          {saving ? "Démarrage..." : "Démarrer le trajet"}
        </button>}
        {trip.statut === "en_cours" && <button type="button" onClick={changeStatus} disabled={saving}>
          {saving ? "Enregistrement..." : "Terminer le trajet"}
        </button>}
      </div>
      {trip.statut === "termine" && <p>Ce trajet est terminé.</p>}
    </>}
    <Link to="/chauffeur/trajets">Retour aux trajets</Link>
  </section>;
}
