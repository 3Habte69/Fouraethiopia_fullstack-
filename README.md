# Fouraethiopia — Full Build

Features:
- Next.js (App Router) + Tailwind
- MongoDB (Mongoose) with JWT auth (register/login) and Google Sign-In (ID token verify → app JWT)
- Admin whitelist via `ADMIN_EMAILS`
- Exams: create (admin), list with filters, detail page with embedded PDF viewer
- File upload to Vercel Blob (signed upload URL)
- Browse page with Ethiopian university presets and semesters
- Tasks page with **Add Task / Feature** modal and backend storage
- Seeder endpoint to auto-create admin + sample Ethiopian-style exams and tasks

## Getting started
1. `npm install`
2. Create `.env` by copying `.env.example` and fill values.
3. `npm run dev`

## Deploy to Vercel
Add env vars:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `VERCEL_BLOB_RW_TOKEN`
- `ADMIN_EMAILS` (comma-separated)
- `SEED_KEY`

## One-time Seeding
Open: `/api/dev/seed?key=YOUR_SEED_KEY` after deploy. Returns admin login (password: `Admin$12345`).

## Notes
- PDF viewer uses `<iframe>`; provide any public PDF URL (or upload via Admin to Vercel Blob).
- Tasks POST does not require auth (so users can suggest features). You can restrict it later if needed.
