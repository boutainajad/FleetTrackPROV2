export default function AppShell({ user, onLogout, children }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <span>FleetTrackPRO</span>
        <div className="shell-user">
          <span>{user}</span>
          <button onClick={onLogout} className="logout-btn">Déconnexion</button>
        </div>
      </header>
      <main className="shell-content">{children}</main>
    </div>
  );
}