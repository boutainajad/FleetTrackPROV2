import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-menu">
        <NavLink to="/admin/utilisateurs" className="menu-btn">
          Utilisateurs
        </NavLink>
        <NavLink to="/admin/camions" className="menu-btn">
          Camions
        </NavLink>
        <NavLink to="/admin/remorques" className="menu-btn">
          Remorques
        </NavLink>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}