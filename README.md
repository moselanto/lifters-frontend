# Lifters SACCO — Front End (API Mode)

This is the "API mode" front end. Instead of single-device browser storage, it
authenticates against the backend API and shares one online database across all users.

## Files
- `api.js`         — API client (fetch + JWT). Set the backend URL once here or via window.LIFTERS_API_BASE.
- `index_api.html` — unified app (login + dashboard + members/savings/loans) talking to the API.

## How it works
1. On the login screen, set the **API base URL** (defaults to http://localhost:4000) and click **Test**
   — the dot turns green when the backend `/health` responds.
2. Sign in with a real account (seeded default: `admin` / `Lifters@2026`).
   `Api.login()` stores the JWT in localStorage and every request sends `Authorization: Bearer <token>`.
3. The app loads members, savings balances and loans via `fetch` and renders them.
4. If the backend is unreachable, click **continue in demo mode** to browse local sample data.

## Point it at your deployed backend
Either edit the URL on the login screen, or hard-set it before `api.js` loads:
```html
<script>window.LIFTERS_API_BASE = 'https://api.lifters.example';</script>
<script src="api.js"></script>
```
Also set `CORS_ORIGIN` on the backend to this front end's domain.

## Extending
`api.js` already exposes helpers for every backend route (members, savings, welfare, loans,
repayments, investments, expenses, profit, reports, notifications, audit). The richer
localStorage front end (full modules + member portal) can be migrated the same way: replace
its `load()/save()` calls with these `Api.*` calls. The patterns in `index_api.html`
(`loadFromApi`, render-from-STATE) show exactly how.

## Serve locally (any static server)
```bash
# from this folder
python3 -m http.server 5173
# then open http://localhost:5173/index_api.html
```
