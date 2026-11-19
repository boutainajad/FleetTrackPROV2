export const BASE_URL = "http://localhost:8080/api";

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Identifiants invalides");
  }

  return await res.json();
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Erreur chargement utilisateurs");
  return await res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Creation refusee");
  return await res.json();
}

export async function getTrucks() {
  const res = await fetch(`${BASE_URL}/trucks`);
  if (!res.ok) throw new Error("Erreur chargement camions");
  return await res.json();
}

export async function createTruck(data) {
  const res = await fetch(`${BASE_URL}/trucks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Création camion refusée");
  return await res.json();
}
export async function updateTruck(id, data) {
  const res = await fetch(`${BASE_URL}/trucks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Modification refusée");
  return await res.json();
}

export async function archiveTruck(id) {
  const res = await fetch(`${BASE_URL}/trucks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Archivage refusé");
  return await res.json();
}