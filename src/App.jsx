import { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import { getMe, getToken, login, setToken } from "./api";

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    function expire() {
      setSession(null);
      setError("Session expiree. Veuillez vous reconnecter.");
    }
    window.addEventListener("fleettrack:unauthorized", expire);
    async function restore() {
      try {
        if (getToken()) {
          const user = await getMe({ signal: controller.signal });
          if (active) setSession({ token: getToken(), user, role: user.role });
        }
      } catch (err) {
        if (active && err.name !== "AbortError") {
          setToken("");
          setError(err.message);
        }
      } finally { if (active) setChecking(false); }
    }
    restore();
    return () => {
      active = false;
      controller.abort();
      window.removeEventListener("fleettrack:unauthorized", expire);
    };
  }, []);

  async function handleLogin(email, password) {
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);
      setSession({ ...result, role: result.user.role });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  function handleLogout() {
    setToken("");
    setSession(null);
    setError("");
  }
  if (checking) return <p role="status">Verification de la session...</p>;
  return <AppRoutes session={session} onLogin={handleLogin} onLogout={handleLogout} loading={loading} error={error} />;
}
