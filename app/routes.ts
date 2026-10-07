import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('servicios', 'routes/servicios._index.tsx'),
  route('servicios/:slug', 'routes/servicios.$slug.tsx'),
  route('industrias', 'routes/industrias._index.tsx'),
  route('industrias/:slug', 'routes/industrias.$slug.tsx'),
  route('empresa', 'routes/empresa.tsx'),
  route('acreditaciones', 'routes/acreditaciones.tsx'),
  route('contacto', 'routes/contacto.tsx'),
  route('cotizar', 'routes/cotizar.tsx'),
  route('cotizar/gracias', 'routes/cotizar.gracias.tsx'),
  route('blog', 'routes/blog._index.tsx'),
  route('lp/:slug', 'routes/lp.$slug.tsx'),
  route('privacidad', 'routes/privacidad.tsx'),
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route('robots.txt', 'routes/robots.txt.ts'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
