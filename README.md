# ParkEase AI - Smart Parking Management System

ParkEase AI is an AI-powered parking management system featuring multi-portal administration, real-time analytics, digital twin parking visualization, automated entry/exit management, dynamic pricing, and occupancy predictions.

---

## Directory Structure

```
ParkEase AI/
├── frontend/             # React + TypeScript + Vite Web Application
│   ├── src/              # Application source code (Portals, Modules, Services, State)
│   ├── public/           # Static assets, images, video & audio
│   ├── package.json      # Frontend dependencies & scripts
│   ├── vite.config.ts    # Vite bundler configuration
│   └── tailwind.config.js# Tailwind CSS configuration
│
├── backend/              # FastAPI Python Backend
│   ├── app/              # FastAPI application (API endpoints, Models, Services, Schemas)
│   ├── Dockerfile        # Container configuration for backend
│   └── requirements.txt  # Python dependencies
│
├── db/                   # Database Utilities & Migration Scripts
│   ├── test-db.ts        # Database connection testing
│   ├── dump-facilities.ts# Data extraction tools
│   └── README.md         # Database schema documentation
│
├── docker-compose.yml    # Docker Compose for PostgreSQL, Redis, & FastAPI
├── package.json          # Root runner delegating commands to frontend
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

---

## Quick Start

### 1. Frontend Development Server
From the root directory, run:
```bash
npm run dev
```
Or directly within `frontend/`:
```bash
cd frontend
npm run dev
```

### 2. Backend FastAPI Server
Using Docker Compose:
```bash
docker-compose up --build
```
Or running Python directly inside `backend/`:
```bash
cd backend
python -m uenv venv
# activate virtual environment
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Build & Linting
```bash
npm run build   # Builds frontend production bundle
npm run lint    # Runs Oxlint code analysis
```
