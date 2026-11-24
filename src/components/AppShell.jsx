export default function AppShell({ user, onLogout, children }) {
  const name = typeof user === "string" ? user : user?.nom || user?.email || "Utilisateur";
  return <div className="shell">
    <header className="shell-header">
      <span>FleetTrackPRO</span>
      <div className="shell-user">
        <span>{name}</span>
        <button type="button" onClick={onLogout} className="logout-btn">Deconnexion</button>
      </div>
    </header>
    <main className="shell-content">{children}</main>
  </div>;
}
