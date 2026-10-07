import { SITE_URL } from '~/content/company'
import { industries } from '~/content/industries'
import { services } from '~/content/services'
import { blog } from '~/lib/cms'

export async function loader() {
  const posts = await blog.getPosts()
  const today = new Date().toISOString().slice(0, 10)
  const paths = [
    '/',
    '/servicios',
    ...services.map((s) => `/servicios/${s.slug}`),
    '/industrias',
    ...industries.map((i) => `/industrias/${i.slug}`),
    '/empresa',
    '/acreditaciones',
    '/contacto',
    '/cotizar',
    ...(posts.length ? ['/blog', ...posts.map((p) => `/blog/${p.slug}`)] : []),
    '/privacidad',
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
