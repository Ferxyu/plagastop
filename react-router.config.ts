
import type { Config } from '@react-router/dev/config'
import { services } from './app/content/services'
import { industries } from './app/content/industries'
import { landings } from './app/content/landings'
import { blog } from './app/lib/cms'

const isGitHubPages = process.env.DEPLOY_GH_PAGES === 'true'

export default {
  appDirectory: 'app',

  basename: isGitHubPages ? '/plagastop/' : '/',

  ssr: false,

  // Sitio estático: cada ruta se genera como HTML completo al compilar. Los artículos del blog se
  // piden a su fuente (artículos del sitio y, si está configurado, WordPress) en ese momento; publicar uno nuevo requiere un build.
  prerender: async () => [
    '/',
    '/servicios',
    ...services.map((s) => `/servicios/${s.slug}`),
    '/industrias',
    ...industries.map((i) => `/industrias/${i.slug}`),
    '/empresa',
    '/acreditaciones',
    '/contacto',
    '/cotizar',
    '/cotizar/gracias',
    '/blog',
    ...(await blog.getPosts()).map((p) => `/blog/${p.slug}`),
    ...landings.map((l) => `/lp/${l.slug}`),
    '/privacidad',
    '/sitemap.xml',
    '/robots.txt',
  ],
} satisfies Config
