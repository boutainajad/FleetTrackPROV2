import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../api";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrips()
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div className="filter-row">
        <h2>Trajets</h2>
        <Link to="/admin/trajets/nouveau" className="menu-btn" style={{ textDecoration: 'none' }}>
          + Nouveau trajet
        </Link>
      </div>

      {trips.length === 0 ? (
        <p>Aucun trajet</p>
      ) : (
        <ul className="item-list">
          {trips.map((t) => (
            <li key={t.id} className="item">
              <Link to={`/admin/trajets/${t.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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