import { SITE_URL } from '~/content/company'
import { services } from '~/content/services'
import { blog } from '~/lib/cms'

/**
 * Sitemap de las páginas públicas indexables. Quedan fuera las que llevan noindex (gracias, landings de
 * campaña, 404) y las internas (/api). Solo los artículos llevan <lastmod>, con su fecha real: poner la
 * fecha del build en todas las páginas haría que Google dejara de confiar en el dato.
 */
export async function loader() {
  const posts = await blog.getPosts()
  const lastmod = new Map(posts.map((p) => [`/blog/${p.slug}`, (p.modified ?? p.date).slice(0, 10)]))
  const paths = [
    '/',
    '/servicios',
    ...services.map((s) => `/servicios/${s.slug}`),
    '/empresa',
    '/acreditaciones',
    '/contacto',
    '/cotizar',
    ...(posts.length ? ['/blog', ...posts.map((p) => `/blog/${p.slug}`)] : []),
    '/privacidad',
    '/terminos',
    '/cookies',
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc>${lastmod.has(p) ? `<lastmod>${lastmod.get(p)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
