
import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

const isGitHubPages = process.env.DEPLOY_GH_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? '/plagastop/' : '/',
  plugins: [reactRouter()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  // El prerender de React Router levanta este servidor de vista previa y le pide cada página a "localhost".
  // Sin host fijo, en Windows escucha solo en IPv6 (::1); Node prueba ::1 durante 250 ms y, si el sistema tarda
  // más en aceptar la conexión (build con CPU ocupada), cambia a 127.0.0.1, donde nadie escucha: AggregateError
  // ETIMEDOUT/ECONNREFUSED y "Prerender: Request failed for /servicios/…" intermitente. Con una sola dirección
  // IPv4 no hay carrera entre familias. Solo afecta al build local y a `npm run preview`, no al sitio publicado.
  preview: {
    host: '127.0.0.1',
  },
})
