import { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function ChauffeurSelect({ name = "chauffeur", disabled = false, defaultValue = "" }) {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getUsers({ signal: controller.signal })
      .then((users) => {
        setChauffeurs(users.filter((user) => user.role === "chauffeur" && user.statut === "actif"));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  return <div>
    <label htmlFor={name}>Chauffeur</label>
    <select id={name} name={name} defaultValue={defaultValue} required disabled={disabled}>
      <option value="">{loading ? "Chargement..." : "Choisir un chauffeur"}</option>
      {chauffeurs.map((chauffeur) => <option key={chauffeur._id} value={chauffeur._id}>
        {chauffeur.nom}
      </option>)}
    </select>
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && chauffeurs.length === 0 && <p>Aucun chauffeur actif disponible.</p>}
  </div>;
}
