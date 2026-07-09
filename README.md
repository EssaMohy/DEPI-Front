# Plantera Web Client

React frontend for the Plantera plant care platform.

## Quick Start (Docker)

Requires the backend to be running (see [backend README](../backend/README.md)).

```bash
# 1. Clone this repository
git clone -b plan-1-docker-fixes https://github.com/EssaMohy/DEPI-Front.git
cd DEPI-Front

# 2. Configure environment
cp .env.example .env
# Set VITE_API_URL to your backend URL (e.g. http://localhost:8000/api/v1)

# 3. Build and run
docker compose -f compose.yml up -d --build
```

Available at `http://localhost:3001`.

## Dev Mode (Hot-Reload)

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
# Set VITE_API_URL to your running backend (e.g. http://localhost:8000/api/v1)
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
| `VITE_API_BASE_URL` | Same as VITE_API_URL | Base URL for API calls |
| `PORT` | `3000` | Dev server port |

## Tech Stack

- **Framework**: React 18 / TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **UI**: Radix UI, MUI
- **Routing**: React Router v7
- **State**: React Context + Hooks

## Project Structure

```
src/
├── app/                # Main app component and pages
│   ├── components/     # Reusable components (AddPlantModal, DiagnosisModal, etc.)
│   ├── context/       # React contexts (Auth, Plant, Profile, CareLog)
│   ├── hooks/          # Custom hooks (useNotificationSocket, etc.)
│   └── pages/          # Page components
├── data/              # Static data files
├── hooks/             # Shared hooks
├── lib/               # API client and utilities
├── routes/            # Routing configuration
└── styles/            # Global styles
```

## Branch Structure

- `main` — main branch with full application code
- `plan-1-docker-fixes` — Docker configuration branch (for parent repo integration)

When working with the parent repository, the root repo references the `plan-1-docker-fixes` branch.

## Production Build

The production Docker image uses nginx to serve the built static files:

```bash
docker build -t plantera-web .
docker run -p 3001:3000 plantera-web
```

For full stack setup, see the [parent repository](https://github.com/EssaMohy/DEPI-Project).