import type { Config } from '@react-router/dev/config'
import { services } from './app/content/services'
import { industries } from './app/content/industries'
import { landings } from './app/content/landings'

export default {
  appDirectory: 'app',
  // Sitio estático: cada ruta se prerenderiza a HTML en el build.
  // El blog (fase 2) podrá pasar a SSR o a prerender disparado por webhook de WordPress.
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
