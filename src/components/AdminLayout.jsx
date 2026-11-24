import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return <div className="admin-layout">
    <nav className="admin-menu" aria-label="Administration">
      <NavLink to="/admin" end className="menu-btn">Accueil</NavLink>
      <NavLink to="/admin/utilisateurs" className="menu-btn">Utilisateurs</NavLink>
      <NavLink to="/admin/camions" className="menu-btn">Camions</NavLink>
      <NavLink to="/admin/remorques" className="menu-btn">Remorques</NavLink>
      <NavLink to="/admin/trajets" className="menu-btn">Trajets</NavLink>
    </nav>
    <div className="admin-content"><Outlet /></div>
  </div>;
}
