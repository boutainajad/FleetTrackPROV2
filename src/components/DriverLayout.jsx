import { useState } from "react";

export default function DriverLayout({ user }) {
  const [view, setView] = useState("home");

  return (
    <div className="admin-layout">
      <nav className="admin-menu">
        <button
          className={view === "home" ? "menu-btn active" : "menu-btn"}
          onClick={() => setView("home")}
        >
          Accueil
        </button>
        <button
          className={view === "trips" ? "menu-btn active" : "menu-btn"}
          onClick={() => setView("trips")}
        >
          Mes trajets
        </button>
      </nav>

      <div className="admin-content">
        {view === "home" && (
          <>
            <h2>Bienvenue, {user}</h2>
            <p>Vous etes connecte en tant que chauffeur.</p>
          </>
        )}

        {view === "trips" && (
          <>
            <h2>Mes trajets</h2>
            <p>Cette fonctionnalite sera disponible dans la prochaine version (API non exposee).</p>
          </>
        )}
      </div>
    </div>
  );
}