# Database & Utilities (`db/`)

This directory contains database scripts, data migration/seed tools, and environment testing utilities for ParkEase AI.

## Database Services
ParkEase AI utilizes:
1. **PostgreSQL** (Relational Database) - Configured via Docker (`docker-compose.yml`) for primary application data.
2. **Firebase Realtime Database & Auth** - Used for real-time state synchronization, live parking space monitoring, and authentication.
3. **Redis** - In-memory caching and session store.

## Included Scripts
- `test-db.ts` - Verifies Firebase Database connectivity and user roles.
- `dump-facilities.ts` - Dumps current facilities data from Firebase.
- `test-login.ts` - Tests Firebase Auth authentication flows.
- `fix-ts.cjs` - Developer utility script for batch updating mock data schemas.

## Usage
To run TypeScript database test scripts:
```bash
npx tsx db/test-db.ts
```
