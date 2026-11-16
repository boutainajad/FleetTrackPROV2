import { useState } from "react";
import LoginForm from "./components/LoginForm";
import AppShell from "./components/AppShell";
import AdminLayout from "./components/AdminLayout";
import DriverLayout from "./components/DriverLayout";
import ProtectedView from "./components/ProtectedView";
import UserList from "./components/UserList";
import TruckList from "./components/TruckList";
import { login as apiLogin } from "./api";
import "./styles.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(username, password) {
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin(username, password);
      setSession(data);
      setView("users");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setSession(null);
    setView("users");
    setError("");
  }

  if (!session) {
    return <LoginForm onLogin={handleLogin} loading={loading} error={error} />;
  }

  if (session.role === "ADMIN") {
    return (
      <AppShell user={session.username} onLogout={handleLogout}>
        <ProtectedView session={session} allowedRoles={["ADMIN"]}>
          <AdminLayout view={view} onNavigate={setView}>
            {view === "users" && <UserList />}
            {view === "trucks" && <TruckList />}
          </AdminLayout>
        </ProtectedView>
      </AppShell>
    );
  }

  return (
    <AppShell user={session.username} onLogout={handleLogout}>
      <DriverLayout user={session.username} />
    </AppShell>
  );
}