# Alpha 60 Gym Management

Owner dashboard for members, daily attendance, and monthly payments. React, TypeScript, Vite, Tailwind, Firebase Auth + Firestore.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Firebase web app values (Firebase console → Project settings → Your apps).

For production builds, use `.env.production` or set the same `VITE_FIREBASE_*` variables in your host’s build environment.

## Scripts

| Command        | Description |
| -------------- | --------------------- |
| `npm run dev`  | Dev server            |
| `npm run build`| Typecheck + production bundle |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint                |

## First run

The first signed-up user creates the `app/bootstrap` doc; after that only sign-in is allowed for that project.
