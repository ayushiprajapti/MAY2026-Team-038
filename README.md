# INTACH Heritage Management System

A web application for the **INTACH Pune Conservation Chapter** to manage heritage sites, events, volunteers, shop orders, and expert chat — all through a role-based admin dashboard and a public-facing portal.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Chart.js |
| Maps | Leaflet + React-Leaflet |
| State | React local state + `localStorage` |

---

## Prerequisites

Make sure you have the following installed before proceeding:

- **Node.js** v18 or later — [https://nodejs.org](https://nodejs.org)
- **npm** v9 or later (comes bundled with Node.js)

Verify your versions:

```bash
node -v
npm -v
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ayushiprajapti/MAY2026-Team-038.git
cd MAY2026-Team-038
```

### 2. Install dependencies

All source code lives inside the `frontend/` directory.

```bash
cd frontend
npm install
```

This will download all required packages listed in `package.json` into a local `node_modules/` folder.

---

## Running the App

### Development server (with hot-reload)

```bash
npm run dev
```

The app will start on **http://localhost:5173** by default.  
Open that URL in your browser. Changes to source files will reflect instantly without a full reload.


## Project Structure

```
MAY2026-Team-038/
└── frontend/
    ├── public/               # Static assets served as-is
    ├── src/
    │   ├── assets/           # Images and illustrations
    │   ├── components/       # Reusable UI components (grouped by feature)
    │   │   ├── admin/
    │   │   ├── admin-dashboard/
    │   │   ├── admin-shop/
    │   │   ├── EventCoordinator/
    │   │   └── shared/       # AdminSidebar, AdminLayout, Navbar, etc.
    │   ├── data/             # Static seed data (events, products, etc.)
    │   ├── hooks/            # Custom React hooks
    │   ├── pages/            # Top-level route pages
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminEvents.jsx
    │   │   ├── AdminEventCreate.jsx
    │   │   ├── AdminShop.jsx
    │   │   ├── Login.jsx
    │   │   └── ...
    │   ├── utils/            # Helper utilities
    │   ├── App.jsx           # Root component with route definitions
    │   ├── main.jsx          # React DOM entry point
    │   └── index.css         # Global design tokens & Tailwind base
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Default Login Credentials

The app uses `localStorage`-based auth with two seeded accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@intachpune.org` | `admin123` |
| **Member / Volunteer** | `user@intachpune.org` | `user123` |

> These credentials are seeded automatically on first load inside `Login.jsx`.

---

## Key Routes

| Path | Description |
|---|---|
| `/` | Public homepage |
| `/login` | Login page |
| `/admin-dashboard` | Admin dashboard (admin only) |
| `/admin/events` | Manage heritage events |
| `/admin/events/create` | Create or edit an event |
| `/admin-shop` | Heritage shop administration |
| `/admin-db` | Heritage database |
| `/admin-chat` | Expert chat |
| `/admin` | Volunteer submission review |
| `/events` | Public events listing |
| `/heritage` | Heritage sites explorer |
| `/volunteer` | Volunteer upload portal |

---


## Notes

- Data is persisted in the browser's **`localStorage`** — clearing browser storage resets all admin-created events, products, and registrations to their seeded defaults.
