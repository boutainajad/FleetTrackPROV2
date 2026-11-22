import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTrailers } from "../api";

export default function TrailerList() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrailers()
      .then((data) => {
        setTrailers(data);
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
        <h2>Remorques</h2>
        <Link to="/admin/remorques/nouveau" className="menu-btn" style={{ textDecoration: 'none' }}>
          + Nouvelle remorque
        </Link>
      </div>

      {trailers.length === 0 ? (
        <p>Aucune remorque</p>
      ) : (
        <ul className="item-list">
          {trailers.map((t) => (
            <li key={t.id} className="item">
              <Link to={`/admin/remorques/${t.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <strong>{t.plateNumber}</strong>
                <span className="role-badge">{t.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}