
import type { Config } from '@react-router/dev/config'
import { services } from './app/content/services'
import { industries } from './app/content/industries'
import { landings } from './app/content/landings'

const isGitHubPages = process.env.DEPLOY_GH_PAGES === 'true'

export default {
  appDirectory: 'app',

  basename: isGitHubPages ? '/plagastop/' : '/',

  ssr: false,

  prerender: [
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
    ...landings.map((l) => `/lp/${l.slug}`),
    '/privacidad',
    '/sitemap.xml',
    '/robots.txt',
  ],
} satisfies Config
