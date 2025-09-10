// packages/auth/src/bootstrap.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * Resolve registry URL:
 * - Prefer process.env (Webpack EnvironmentPlugin in both dev/prod builds)
 * - Fall back to import.meta.env only in dev
 * - In production, if nothing is set -> skip self-register
 */
const ENV_REGISTRY =
  (typeof process !== 'undefined' && (process as any)?.env?.VITE_REGISTRY_URL) ||
  (typeof import.meta !== 'undefined' &&
    (import.meta as any)?.env?.DEV &&
    (import.meta as any)?.env?.VITE_REGISTRY_URL) ||
  '';

const REGISTRY_URL =
  ENV_REGISTRY ||
  ((typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV)
    ? 'http://localhost:4000/registry'   // dev default only
    : '');                                // prod default: disabled

async function selfRegister() {
  if (!REGISTRY_URL) {
    console.log('ℹ️ Registry not configured; skipping auth self-register.');
    return;
  }
  try {
    const res = await fetch('/plugin-manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('manifest not found');
    const manifest = await res.json();
    await fetch(REGISTRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manifest),
    });
    console.log('✅ Registered plugin:', manifest.scope);
  } catch (e) {
    console.warn('⚠️ Plugin self-register failed', e);
  }
}
// Trigger once on startup
selfRegister();

const mount = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el);
  const isStandalone = !String(window.name || '').includes('host');

  root.render(
    <React.StrictMode>
      {isStandalone ? (
        <Router>
          <App />
        </Router>
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
};

// Dev isolation mount
if ((import.meta as any)?.env?.DEV) {
  const devRoot = document.getElementById('root');
  if (devRoot && !String(window.name || '').includes('host')) {
    mount(devRoot);
  }
}

export { mount };
