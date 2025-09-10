// auth/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/components/Login'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: { modulePreload: { polyfill: false } },
  server: { port: 3001, strictPort: true }
})