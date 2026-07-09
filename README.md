# Plantera Web Client

React frontend for the Plantera plant care platform.

## Quick Start (Docker Standalone)

Requires the backend to be running (see [backend README](../backend/README.md)).

```bash
# From apps/web/
docker compose -f compose.yml up -d --build
```

Available at `http://localhost:3001`.

Dev mode (hot-reload):
```bash
docker compose -f compose.yml -f compose.override.yml up -d --build
```
Available at `http://localhost:3002`.

The web connects to `http://localhost:8000/api/v1` by default (production) or `http://localhost:8001/api/v1` (dev). Override with `VITE_API_URL`.

## Running Locally (Without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# VITE_API_URL should point to your running backend
```

### 3. Start Dev Server

```bash
npm run dev
```

Available at `http://localhost:5173` (Vite default).

## Building for Production

```bash
npm run build
```

Produces an optimized static build in `dist/`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Backend API URL |
| `PORT` | `3000` | Dev server port |

## Tech Stack

- **Framework**: React 18 / TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **UI**: Radix UI, MUI
- **Routing**: React Router v7
