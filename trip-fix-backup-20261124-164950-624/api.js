export const BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
const TOKEN_KEY = "fleettrack.token";
let token = "";
try { token = localStorage.getItem(TOKEN_KEY) || ""; } catch {}

export function setToken(value) {
  token = value || "";
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
export function getToken() { return token; }

export async function request(path, { method = "GET", body, signal, auth = true } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method, signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("API inaccessible. Verifiez le serveur, son URL et la configuration CORS.");
  }
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) {
    if (auth && response.status === 401) {
      setToken("");
      window.dispatchEvent(new Event("fleettrack:unauthorized"));
    }
    const error = new Error(data?.message || `Erreur API (${response.status})`);
    error.status = response.status;
    throw error;
  }
  if (text && data === null) throw new Error("La reponse API n'est pas un JSON valide.");
  return data;
}

export function normalizeUser(user) {
  if (!user || !(user._id || user.id) || !["admin", "chauffeur"].includes(user.role)) {
    throw new Error("Utilisateur ou role invalide dans la reponse API.");
  }
  return { ...user, _id: String(user._id || user.id) };
}

export async function getMe(options) {
  const result = await request("/auth/me", options);
  return normalizeUser(result?.user);
}
export async function login(email, password) {
  const result = await request("/auth/login", { method: "POST", body: { email, password }, auth: false });
  const accessToken = result?.token || result?.accessToken;
  if (!accessToken) throw new Error("Token manquant dans la reponse de connexion.");
  setToken(accessToken);
  try {
    const user = result.user ? normalizeUser(result.user) : await getMe();
    return { token: accessToken, user };
  } catch (error) {
    setToken("");
    throw error;
  }
}
export const register = (body) => request("/auth/register", { method: "POST", body, auth: false });

export async function getList(resource, options) {
  const result = await request(`/${resource}`, options);
  if (!Array.isArray(result?.data)) throw new Error("Format de liste API invalide : data doit etre un tableau.");
  return resource.split("/")[0] === "trajets" ? result.data.map(normalizeTrip) : result.data;
}
function normalizeTrip(trip) {
  if (!trip?._id) throw new Error("Trajet invalide dans la réponse API.");
  return { ...trip, _id: String(trip._id), statut: trip.statut === "a_faire" ? "planifie" : trip.statut };
}
export const getCamions = (options) => getList("camions", options);
export const getTrucks = getCamions;
export const getUsers = (options) => getList('auth/users', options);
export async function createUser(body) {
  const result = await request('/auth/users', { method: 'POST', body });
  return normalizeUser(result.user);
}
export const getRemorques = (options) => getList("remorques", options);
export const getTrailers = getRemorques;
export const getTrajets = (options) => getList("trajets", options);
export const getTrips = getTrajets;
export const getMesTrajets = (options) => getList("trajets/mes-trajets", options);
export const getMyTrips = getMesTrajets;
export async function getMyTripById(id, options) {
  const trips = await getMyTrips(options);
  const trip = trips.find((item) => item._id === String(id));
  if (!trip) throw new Error("Trajet introuvable dans vos trajets.");
  return trip;
}
export const getItem = (resource, id, options) => request(`/${resource}/${encodeURIComponent(id)}`, options);
export const createItem = (resource, body) => request(`/${resource}`, { method: "POST", body });
export const updateItem = (resource, id, body) => request(`/${resource}/${encodeURIComponent(id)}`, { method: "PUT", body });
export const archiveItem = (resource, id) => request(`/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" });
export const createTrip = (body) => createItem("trajets", body);
export const assignTrip = (id, body) => request(`/trajets/${encodeURIComponent(id)}/assigner`, { method: "PUT", body });
export async function recordMileage(id, stage, body) {
  if (!["km-depart", "km-arrivee"].includes(stage)) throw new Error("Etape de trajet invalide.");
  const result = await request(`/trajets/${encodeURIComponent(id)}/${stage}`, { method: "PATCH", body });
  return normalizeTrip(result.trajet);
}

export async function updateTripStatus(id, statut) {
  if (!["en_cours", "termine"].includes(statut)) throw new Error("Statut invalide.");
  const result = await request(`/trajets/${encodeURIComponent(id)}/statut`, {
    method: "PATCH",
    body: { statut },
  });
  return normalizeTrip(result.trajet);
}
