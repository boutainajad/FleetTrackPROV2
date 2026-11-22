import { useState } from "react";
import AppRoutes from "./AppRoutes";
import { login as apiLogin } from "./api";
import "./styles.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(username, password) {
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin(username, password);
      setSession(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setSession(null);
  }

  return (
    <AppRoutes
      session={session}
      onLogin={handleLogin}
      onLogout={handleLogout}
      loading={loading}
      error={error}
    />
  );
}