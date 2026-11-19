# FleetTrackPRO - Frontend React

Application de gestion de flotte (Sprint 3). Frontend connecté à une API REST locale.

## Installation

1. Cloner le projet.
2. `npm install`
3. `npm run dev` (Frontend sur http://localhost:5173)
4. `node server.cjs` (Faux backend sur http://localhost:8080)

## Comptes de test
- Admin : `admin_test` / `admin123`
- Chauffeur : `driver_ali` / `driver123`
- Suspendu : `driver_suspended` / `driver123`

## Contrat API (Faux Backend)
- **Login** : `POST /api/auth/login` -> `{ token, role, username }`
- **Utilisateurs** : `GET /api/users`, `POST /api/users`
- **Camions** : `GET /api/trucks`, `POST /api/trucks`, `PUT /api/trucks/:id`, `DELETE /api/trucks/:id`

## Architecture des composants
- `App.jsx` : Détient la session et la vue active.
- `LoginForm.jsx` : Formulaire contrôlé.
- `ProtectedView.jsx` : Vérifie le rôle avant d'afficher les enfants.
- `AdminLayout.jsx` / `DriverLayout.jsx` : Layouts par rôle.
- `UserList.jsx` / `TruckList.jsx` : Listes, filtres, formulaires.

## Écarts documentés
- La route "Mes trajets" n'est pas exposée par le backend. Un message l'indique dans l'espace Chauffeur.

## Preuves
- Capture 403 : à ajouter dans `/docs`.