export default function ProtectedView({ session, allowedRoles, children }) {
  if (!session) return <p className="error">Connexion requise.</p>;
  if (!allowedRoles.includes(session.role)) {
    return <p className="error"> Accès refusé.</p>;
  }
  return children;
}