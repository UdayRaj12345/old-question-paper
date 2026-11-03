# PaperHub — corrected source

This project uses a React/Vite frontend and an Express/MySQL backend. Do not commit `.env` files or credentials.

## Requirements

- Node.js 22 LTS (or a version supported by the locked Vite version)
- MySQL 8+
- A Cloudinary account for PDF and note uploads

## 1. Set up MySQL

Create a database and a user, then run these SQL files in order against that database:

1. `server/create_base_tables.sql`
2. `server/create_school_classes.sql`
3. `server/create_papers.sql`
4. `server/create_feature_tables.sql`

`CREATE TABLE IF NOT EXISTS` will not repair an existing table with a different structure. Back up an existing database and compare its schema before running migrations. These files create tables; they do not migrate existing MongoDB data.

## 2. Configure backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your own database password, a long random `JWT_SECRET`, Cloudinary credentials, and frontend URL. Never share or commit this file. If any real credentials were included in an older ZIP or Git commit, rotate them in the provider dashboard.

Install and run:

```bash
npm ci
npm run dev
```

Backend default: `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 3. Configure frontend

In another terminal:

```bash
cd client
npm ci
npm run dev
```

Open `http://localhost:5173`. The Vite development proxy sends `/api` requests to `http://localhost:5000`.

For Vercel deployment, set `VITE_API_URL` to the full backend API URL, for example `https://YOUR-RENDER-SERVICE.onrender.com/api`, and rebuild. On Render, set `FRONTEND_URL` to the exact deployed Vercel origin (no trailing slash). Make sure these two URLs refer to the current deployments.

## 4. Test in order

1. Open `/api/health` and verify the server responds.
2. Verify `/api/academic/universities`, `/api/academic/courses`, and `/api/academic/subjects` return JSON.
3. Register a normal student and test login/logout.
4. Test paper list/search and a paper details page.
5. Test PDF upload/download with valid Cloudinary credentials.
6. Test comments, ratings, bookmarks, notes, and reports after applying `create_feature_tables.sql`.
7. Test admin-only endpoints with a trusted Admin account; public registration deliberately cannot create Admin/Faculty users.

## Notes

- `server/seeder.js` is intentionally a non-destructive MySQL connectivity check. It no longer runs the old MongoDB `deleteMany()` seeder.
- The old Mongoose model files are legacy code and are not used by the currently migrated SQL controllers. Some other optional legacy models/features may still need migration before those features are enabled.
- Build verification must be performed after `npm ci` on the target OS because native Vite/Rolldown optional dependencies are platform-specific.
