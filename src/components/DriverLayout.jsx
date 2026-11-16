export default function AdminLayout({ view, onNavigate, children }) {
  return (
    <div className="admin-layout">
      <nav className="admin-menu">
        <button
          className={view === "users" ? "menu-btn active" : "menu-btn"}
          onClick={() => onNavigate("users")}
        >
           Utilisateurs
        </button>
        <button
          className={view === "trucks" ? "menu-btn active" : "menu-btn"}
          onClick={() => onNavigate("trucks")}
        >
           Camions
        </button>
      </nav>
      <div className="admin-content">{children}</div>
    </div>
  );
}