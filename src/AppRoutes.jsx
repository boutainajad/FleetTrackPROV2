import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AppShell from "./components/AppShell";
import AdminLayout from "./components/AdminLayout";
import DriverLayout from "./components/DriverLayout";
import UserList from "./components/UserList";
import TruckList from "./components/TruckList";
import TrailerList from "./components/TrailerList";
import TrailerDetail from "./components/TrailerDetail";
import TrailerForm from "./components/TrailerForm";

function RequireRole({ session, allowedRole, children }) {
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== allowedRole) return <Navigate to="/403" replace />;
  return children;
}

export default function AppRoutes({ session, onLogin, onLogout, loading, error }) {
  return (
    <Routes>
      <Route path="/login" element={
        session 
          ? <Navigate to={session.role === "ADMIN" ? "/admin" : "/chauffeur"} replace /> 
          : <LoginForm onLogin={onLogin} loading={loading} error={error} />
      } />

      <Route path="/403" element={
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Acces refuse</h2>
          <p>Vous n'avez pas les droits pour acceder a cette page.</p>
          <a href={session?.role === "ADMIN" ? "/admin" : "/chauffeur"}>
            Retour a l'accueil
          </a>
        </div>
      } />

      <Route path="/admin" element={
        <RequireRole session={session} allowedRole="ADMIN">
          <AppShell user={session?.username} onLogout={onLogout}>
            <AdminLayout />
          </AppShell>
        </RequireRole>
      }>
        <Route index element={<div style={{ padding: 20 }}>Bienvenue dans l'espace Admin</div>} />
        <Route path="utilisateurs" element={<UserList />} />
        <Route path="camions" element={<TruckList />} />
        <Route path="remorques" element={<TrailerList />} />
        <Route path="remorques/nouveau" element={<TrailerForm />} />
        <Route path="remorques/:id" element={<TrailerDetail />} />
      </Route>

      <Route path="/chauffeur" element={
        <RequireRole session={session} allowedRole="DRIVER">
          <AppShell user={session?.username} onLogout={onLogout}>
            <DriverLayout />
          </AppShell>
        </RequireRole>
      }>
        <Route index element={<div style={{ padding: 20 }}>Bienvenue Chauffeur</div>} />
        <Route path="trajets" element={<div style={{ padding: 20 }}>Mes trajets (a venir)</div>} />
      </Route>

      <Route path="/" element={
        <Navigate to={session ? (session.role === "ADMIN" ? "/admin" : "/chauffeur") : "/login"} replace />
      } />
      
      <Route path="*" element={
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>404 - Page introuvable</h2>
          <a href="/">Retour a l'accueil</a>
        </div>
      } />
    </Routes>
  );
}