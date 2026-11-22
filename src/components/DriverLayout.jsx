import { NavLink, Outlet } from "react-router-dom";

export default function DriverLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-menu">
        <NavLink to="/chauffeur" end className="menu-btn">
          Accueil
        </NavLink>
        <NavLink to="/chauffeur/trajets" className="menu-btn">
          Mes trajets
        </NavLink>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}