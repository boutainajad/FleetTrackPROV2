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
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  if (user.active === false) return res.status(403).json({ error: "Compte suspendu" });
  res.json({ token: "fake-token-" + user.id, role: user.role, username: user.username });
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

app.listen(8080, () => {
  console.log("✅ Backend sur http://localhost:8080/api");
});