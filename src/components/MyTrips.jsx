import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTrips } from "../api";

export default function MyTrips({ session }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || !session.id) {
      setError("Erreur d'identite du chauffeur");
      setLoading(false);
      return;
    }

    getMyTrips(session.id)
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [session]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Mes Trajets</h2>
      {trips.length === 0 ? (
        <p>Aucun trajet ne vous est assigne pour le moment.</p>
      ) : (
        <ul className="item-list">
          {trips.map((t) => (
            <li key={t.id} className="item">
              <Link to={`/chauffeur/trajets/${t.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{t.departure} ➔ {t.arrival}</span>
                <span className="role-badge">{t.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}