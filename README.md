# auth-app — Authentication Micro‑Frontend

## 1) Setup
```bash
npm install
npm start     # → http://localhost:3001
npm run build # → dist/
```

## 2) Architecture Decisions
- **Exposes**: `./Login`, `./UserProfile` via Module Federation.
- **Standalone vs federated**: Router in dev; only exposed components under Host.
- **Shared singletons**: `react`, `react-dom`, `react-router-dom`.
- **Optional self‑register**: `bootstrap` POSTs `public/plugin-manifest.json` to `VITE_REGISTRY_URL`.

## 3) Communication Design
- **Props from Host**:
  - `Login` → `onLogin(user)`.
  - `UserProfile` → `onLogout()`.
- **Events**: emits `auth:login` / `auth:logout` on event bus.
- **Registry example**:
```json
{
  "name": "auth-app",
  "displayName": "Authentication",
  "scope": "authApp",
  "url": "https://arh-mfe-auth.vercel.app/remoteEntry.js",
  "routes": ["/login", "/profile"],
  "roles": ["user", "admin"],
  "module": "./Login"
}
```
