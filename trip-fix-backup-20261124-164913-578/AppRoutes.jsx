import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AppShell from "./components/AppShell";
import AdminLayout from "./components/AdminLayout";
import DriverLayout from "./components/DriverLayout";
import MyTrips from "./components/MyTrips";
import UserList from "./components/UserList";
import ChauffeurSelect from "./components/ChauffeurSelect";
import { archiveItem, assignTrip, createItem, getItem, getList, updateItem } from "./api";

function home(session) {
  if (!session) return "/login";
  return session.role === "admin" ? "/admin" : session.role === "chauffeur" ? "/chauffeur" : "/403";
}
function RequireRole({ session, role, children }) {
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to="/403" replace />;
  return children;
}

const fields = {
  camions: [["immatriculation", "Immatriculation"], ["marque", "Marque"], ["modele", "Modele"], ["kilometrage", "Kilometrage", "number"]],
  remorques: [["immatriculation", "Immatriculation"], ["capacite", "Capacite", "number"], ["kilometrage", "Kilometrage", "number"]],
  trajets: [["siteDepart", "Depart"], ["siteArrivee", "Arrivee"], ["marchandise", "Marchandise"], ["dateDepartPrevue", "Depart prevu", "datetime-local"], ["dateArriveePrevue", "Arrivee prevue", "datetime-local"]],
};
function title(item) {
  return item.immatriculation || `${item.siteDepart} → ${item.siteArrivee}`;
}
function ResourceList({ resource }) {
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  useEffect(() => {
    const controller = new AbortController();
    getList(resource, { signal: controller.signal }).then(
      (items) => setState({ loading: false, items, error: "" }),
      (err) => { if (err.name !== "AbortError") setState({ loading: false, items: [], error: err.message }); },
    );
    return () => controller.abort();
  }, [resource]);
  return <section>
    <h2>{resource}</h2>
    <Link to={`/admin/${resource}/nouveau`}>+ Nouveau</Link>
    {state.loading && <p role="status">Chargement...</p>}
    {state.error && <p role="alert" className="error">{state.error}</p>}
    {!state.loading && !state.error && !state.items.length && <p>Aucun resultat.</p>}
    <ul className="item-list">{state.items.map((item) => <li key={item._id} className="item">
      <Link to={`/admin/${resource}/${item._id}`}>{title(item)}</Link>
      <span className="role-badge">{item.statut}</span>
    </li>)}</ul>
  </section>;
}
function ResourceForm({ resource, initial, onSaved }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = Object.fromEntries(fields[resource].map(([name, , type]) => {
      const value = values.get(name);
      return [name, type === "number" ? Number(value) : type === "datetime-local" ? new Date(value).toISOString() : value.trim()];
    }));
    if (resource !== "trajets") body.statut = values.get("statut");
    if (resource === "trajets") body.chauffeur = values.get("chauffeur");
    setSaving(true);
    setError("");
    try {
      const result = initial ? await updateItem(resource, initial._id, body) : await createItem(resource, body);
      if (onSaved) onSaved(result);
      else navigate(`/admin/${resource}`);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <form className="user-form" onSubmit={submit}>
    <h3>{initial ? "Modifier" : "Nouveau"} : {resource}</h3>
    {fields[resource].map(([name, label, type = "text"]) => <div key={name}>
      <label htmlFor={name}>{label}</label>
      {name === "marchandise" ? (
        <select id={name} name={name} defaultValue={initial?.[name] || ""} required disabled={saving}>
          <option value="">Choisir une marchandise</option>
          {initial?.[name] && !["Alimentaire", "Matériaux", "Textile"].includes(initial[name]) && (
            <option value={initial[name]}>{initial[name]}</option>
          )}
          {["Alimentaire", "Matériaux", "Textile"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input id={name} name={name} type={type} defaultValue={initial?.[name] ?? (type === "number" ? 0 : "")} min={type === "number" ? (name === "capacite" ? 1 : 0) : undefined} step={type === "number" ? "any" : undefined} minLength={type === "text" ? (name === "immatriculation" ? 3 : name === "modele" ? 1 : 2) : undefined} required disabled={saving} />
      )}
    </div>)}
    {resource === "trajets" && <ChauffeurSelect disabled={saving} defaultValue={initial?.chauffeur?._id || initial?.chauffeur || ""} />}
    {resource !== "trajets" && <label>Statut <select name="statut" defaultValue={initial?.statut || "disponible"} disabled={saving}>
      {["disponible", "en_mission", "maintenance", "archive"].map((value) => <option key={value}>{value}</option>)}
    </select></label>}
    {error && <p role="alert" className="error">{error}</p>}
    <button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</button>
  </form>;
}
function AssignmentForm({ id, onSaved }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setError("");
    try { const result = await assignTrip(id, body); onSaved(result.trajet); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <form className="user-form" onSubmit={submit}>
    <h3>Assigner le trajet</h3>
    <ChauffeurSelect name="chauffeurId" disabled={saving} />
    <p>Renseignez les identifiants MongoDB du camion et de la remorque.</p>
    {["camionId", "remorqueId"].map((name) => <label key={name}>{name}
      <input name={name} pattern="[a-fA-F0-9]{24}" required disabled={saving} />
    </label>)}
    {error && <p role="alert" className="error">{error}</p>}
    <button disabled={saving} type="submit">{saving ? "Enregistrement..." : "Assigner"}</button>
  </form>;
}
function ResourceDetail({ resource }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    getItem(resource, id, { signal: controller.signal }).then(setItem).catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    });
    return () => controller.abort();
  }, [resource, id]);
  async function archive() {
    if (!window.confirm("Archiver cette ressource ?")) return;
    setBusy(true);
    try { await archiveItem(resource, id); navigate(`/admin/${resource}`); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="detail-panel">
    <h2>Detail : {resource}</h2>
    {error && <p role="alert" className="error">{error}</p>}
    {!item && !error && <p role="status">Chargement...</p>}
    {item && <>
      <h3>{title(item)}</h3><p>ID : {item._id}</p><p>Statut : {item.statut}</p>
      {fields[resource].map(([name, label]) => <p key={name}>{label} : {item[name]}</p>)}
      {resource === "trajets" ? <AssignmentForm id={id} onSaved={setItem} /> : <>
        <button type="button" onClick={() => setEditing(!editing)}>Modifier</button>
        <button type="button" disabled={busy} onClick={archive}>Archiver</button>
        {editing && <ResourceForm resource={resource} initial={item} onSaved={(value) => { setItem(value); setEditing(false); }} />}
      </>}
    </>}
    <Link to={`/admin/${resource}`}>Retour a la liste</Link>
  </section>;
}

export default function AppRoutes({ session, onLogin, onLogout, loading, error }) {
  return <Routes>
    <Route path="/login" element={session ? <Navigate to={home(session)} replace /> : <LoginForm onLogin={onLogin} loading={loading} error={error} />} />
    <Route path="/admin" element={<RequireRole session={session} role="admin"><AppShell user={session?.user} onLogout={onLogout}><AdminLayout /></AppShell></RequireRole>}>
      <Route index element={<p>Bienvenue dans l'espace Admin.</p>} />
      <Route path="utilisateurs" element={<UserList />} />
      {Object.keys(fields).map((resource) => <Route key={resource} path={resource}>
        <Route index element={<ResourceList key={resource} resource={resource} />} />
        <Route path="nouveau" element={<ResourceForm key={resource} resource={resource} />} />
        <Route path=":id" element={<ResourceDetail key={resource} resource={resource} />} />
      </Route>)}
    </Route>
    <Route path="/chauffeur" element={<RequireRole session={session} role="chauffeur"><AppShell user={session?.user} onLogout={onLogout}><DriverLayout /></AppShell></RequireRole>}>
      <Route index element={<p>Bienvenue Chauffeur.</p>} />
      <Route path="trajets" element={<MyTrips />} />
      <Route path="trajets/:id" element={<MyTrips detail />} />
    </Route>
    <Route path="/403" element={<section><h2>Acces refuse</h2><Link to={session?.role === "admin" || session?.role === "chauffeur" ? home(session) : "/login"}>Retour</Link>{session && <button type="button" onClick={onLogout}>Deconnexion</button>}</section>} />
    <Route path="/" element={<Navigate to={home(session)} replace />} />
    <Route path="*" element={<section><h2>404 - Page introuvable</h2><Link to="/">Retour a l'accueil</Link></section>} />
  </Routes>;
}
