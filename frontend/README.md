# Frontend

React SPA for the INTACH Pune heritage platform — see the [root README](../README.md) for what the platform does as a whole.

## Tech stack

- **React 19** + **Vite 8**
- **React Router DOM v7** — routing
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations
- **Chart.js** — admin dashboard charts
- **Leaflet + React-Leaflet** — heritage site map, trails map

The frontend talks to the backend exclusively over its REST API (`src/api/`) — there's no server-side rendering and no direct database access from here.

## Startup

### 1. Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (bundled with Node.js)
- The [backend](../backend/README.md) running (default `http://localhost:8000`) — most pages need it for real data

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, default `http://localhost:8000` |

### 4. Run the dev server

```bash
npm run dev
```

Opens on `http://localhost:5173` with hot-reload.

### Other scripts

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

## Structure

```
frontend/
├── src/
│   ├── api/                REST client — one module per backend resource (client.js has the
│   │                       shared fetch wrapper + auth token handling)
│   ├── assets/               Images and illustrations
│   ├── components/           Reusable UI, grouped by feature (admin-shop/, EventCoordinator/,
│   │                        shared/, ...)
│   ├── pages/                 Top-level route pages (Home, Login, AdminDashboard, AdminShop,
│   │                        AdminEvents, HeritageShop, TrailsMap, VolunteerPage, ...)
│   ├── hooks/                  Custom React hooks
│   ├── utils/                   Helpers
│   ├── App.jsx                  Route definitions
│   ├── main.jsx                  React DOM entry point
│   └── index.css                  Global design tokens + Tailwind base
├── public/                        Static assets served as-is
├── vite.config.js
└── package.json
```

## Auth

The API client (`src/api/client.js`) stores the JWT returned by `POST /auth/login` in `localStorage` and attaches it as `Authorization: Bearer <token>` on every request. A 401 response clears the stored token and redirects to `/login`.

## Uploads

Image uploads (product photos, event images, heritage-submission photos) go through `apiFetchForm()` in `src/api/client.js`, which posts `multipart/form-data` to the relevant backend `upload-image` endpoint and gets back a Cloudinary URL to use as `image_url`.
