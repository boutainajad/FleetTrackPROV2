const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  if (user.active === false) {
    return res.status(403).json({ error: "Compte suspendu" });
  }

  res.json({ 
    token: "fake-token-" + user.id, 
    role: user.role, 
    username: user.username,
    id: user.id 
  });
});

app.get("/api/users", (req, res) => {
  res.json(readDB().users);
});

app.post("/api/users", (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now(), ...req.body, active: true };
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

app.get("/api/trucks", (req, res) => {
  res.json(readDB().trucks);
});

app.post("/api/trucks", (req, res) => {
  const db = readDB();
  const newTruck = { id: Date.now(), ...req.body };
  db.trucks.push(newTruck);
  writeDB(db);
  res.status(201).json(newTruck);
});

app.put("/api/trucks/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.trucks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Camion introuvable" });
  db.trucks[index] = { ...db.trucks[index], ...req.body };
  writeDB(db);
  res.json(db.trucks[index]);
});

app.delete("/api/trucks/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.trucks = db.trucks.filter((t) => t.id !== id);
  writeDB(db);
  res.json({ success: true });
});

app.get("/api/trailers", (req, res) => {
  res.json(readDB().trailers);
});

app.get("/api/trailers/:id", (req, res) => {
  const db = readDB();
  const trailer = db.trailers.find((t) => t.id === Number(req.params.id));
  if (!trailer) return res.status(404).json({ error: "Remorque introuvable" });
  res.json(trailer);
});

app.post("/api/trailers", (req, res) => {
  const db = readDB();
  const newTrailer = { id: Date.now(), status: "AVAILABLE", ...req.body };
  db.trailers.push(newTrailer);
  writeDB(db);
  res.status(201).json(newTrailer);
});

app.get("/api/trips", (req, res) => {
  res.json(readDB().trips);
});

app.get("/api/trips/:id", (req, res) => {
  const db = readDB();
  const trip = db.trips.find((t) => t.id === Number(req.params.id));
  if (!trip) return res.status(404).json({ error: "Trajet introuvable" });
  res.json(trip);
});

app.post("/api/trips", (req, res) => {
  const db = readDB();
  const { departure, arrival, driverId, truckId, trailerId } = req.body;

  const conflict = db.trips.find(
    (t) => t.truckId === Number(truckId) && t.status === "PLANNED"
  );
  if (conflict) {
    return res.status(409).json({ error: "Ce camion est deja assigne a un autre trajet en cours." });
  }

  const newTrip = {
    id: Date.now(),
    departure,
    arrival,
    driverId: Number(driverId),
    truckId: Number(truckId),
    trailerId: Number(trailerId),
    status: "PLANNED",
  };
  
  db.trips.push(newTrip);
  writeDB(db);
  res.status(201).json(newTrip);
});

app.get("/api/driver/trips", (req, res) => {
  const db = readDB();
  const driverId = Number(req.query.driverId);
  if (!driverId) return res.status(401).json({ error: "Non autorise" });
  const myTrips = db.trips.filter((t) => t.driverId === driverId);
  res.json(myTrips);
});

app.put("/api/trips/:id/status", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.trips.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Trajet introuvable" });
  db.trips[index].status = req.body.status;
  writeDB(db);
  res.json(db.trips[index]);
});

app.listen(8080, () => {
  console.log("✅ Backend sur http://localhost:8080/api");
});