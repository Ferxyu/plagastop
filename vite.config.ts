
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
})
