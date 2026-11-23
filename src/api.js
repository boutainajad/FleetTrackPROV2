export const BASE_URL = "http://localhost:8080/api";

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Identifiants invalides");
  }
  
  return data;
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
  if (!res.ok) throw new Error("Creation camion refusee");
  return await res.json();
}

export async function updateTruck(id, data) {
  const res = await fetch(`${BASE_URL}/trucks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Modification refusee");
  return await res.json();
}

export async function archiveTruck(id) {
  const res = await fetch(`${BASE_URL}/trucks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Archivage refuse");
  return await res.json();
}

export async function getTrailers() {
  const res = await fetch(`${BASE_URL}/trailers`);
  if (!res.ok) throw new Error("Erreur chargement remorques");
  return await res.json();
}

export async function getTrailerById(id) {
  const res = await fetch(`${BASE_URL}/trailers/${id}`);
  if (!res.ok) throw new Error("Remorque introuvable");
  return await res.json();
}

export async function createTrailer(data) {
  const res = await fetch(`${BASE_URL}/trailers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Creation remorque refusee");
  return await res.json();
}

export async function getTrips() {
  const res = await fetch(`${BASE_URL}/trips`);
  if (!res.ok) throw new Error("Erreur chargement trajets");
  return await res.json();
}

export async function getTripById(id) {
  const res = await fetch(`${BASE_URL}/trips/${id}`);
  if (!res.ok) throw new Error("Trajet introuvable");
  return await res.json();
}

export async function createTrip(data) {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 409) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Conflit d'assignation");
  }
  if (!res.ok) throw new Error("Creation du trajet refusee");
  return await res.json();
}

export async function getMyTrips(driverId) {
  const res = await fetch(`${BASE_URL}/driver/trips?driverId=${driverId}`);
  if (!res.ok) throw new Error("Erreur chargement de vos trajets");
  return await res.json();
}

export async function updateTripStatus(id, status) {
  const res = await fetch(`${BASE_URL}/trips/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Mise a jour du statut refusee");
  return await res.json();
}