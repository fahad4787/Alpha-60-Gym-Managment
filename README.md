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

## Live site on GitHub Pages

Your app is a static SPA; GitHub Pages can host `dist` after each push to `main`.

1. **Repository secrets** — either paste each in the GitHub UI, or from the project root (with [GitHub CLI](https://cli.github.com/) installed and `gh auth login` done):

   ```bash
   ./scripts/sync-github-actions-secrets.sh
   ```

   This reads `.env.production` and sets every `VITE_*` variable as a repository secret for `fahad4787/Alpha-60-Gym-Managment`. Override repo: `GITHUB_REPO=owner/other-repo ./scripts/sync-github-actions-secrets.sh`. Use another file: `./scripts/sync-github-actions-secrets.sh .env.local`.

   Manual option: **Settings** → **Secrets and variables** → **Actions** → **Repository secrets** → **New repository secret**. Use the **Repository** tab. Add the same names as in `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

2. **Turn on Pages**  
   **Settings** → **Pages** → **Build and deployment** → **Source**: **GitHub Actions** (not “Deploy from a branch”).

3. **Firebase Auth**  
   [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Settings** → **Authorized domains** → add `fahad4787.github.io` (and your custom domain later if you add one).

4. **Deploy**  
   Push to `main` (including `.github/workflows/deploy-pages.yml`). Open **Actions** to watch the workflow. When it finishes, the site URL is shown on the workflow run (typically `https://fahad4787.github.io/<repo-name>/`).

Local check for the same base path as GitHub:

```bash
VITE_BASE_PATH=/Your-Repo-Name/ npm run build
npm run preview
```
