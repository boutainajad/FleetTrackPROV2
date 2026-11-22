import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrailerById } from "../api";

export default function TrailerDetail() {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getTrailerById(id)
      .then((data) => {
        setTrailer(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!trailer) return null;

  return (
    <div className="detail-panel">
      <h2>Détail de la remorque</h2>
      <p>ID : {trailer.id}</p>
      <p>Immatriculation : {trailer.plateNumber}</p>
      <p>Capacité : {trailer.capacity} tonnes</p>
      <p>Statut : {trailer.status}</p>
      
      <Link to="/admin/remorques" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        Retour à la liste
      </Link>
    </div>
  );
}