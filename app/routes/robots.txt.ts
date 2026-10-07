import { SITE_URL } from '~/content/company'

export function loader() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
