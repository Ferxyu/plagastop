import type { Route } from './+types/blog._index'
import { blog, toSummary } from '~/lib/cms'
import { featuredOf } from '~/lib/blog/utils'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { ButtonLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import { FeaturedPost } from '~/components/blog/FeaturedPost'
import { BlogExplorer } from '~/components/blog/BlogExplorer'
import { BlogCta } from '~/components/blog/BlogCta'
import styles from './page.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
]

/** Se ejecuta al compilar: la lista completa (sin el cuerpo de cada artículo) queda en el HTML estático. */
export async function loader() {
  const posts = (await blog.getPosts()).map(toSummary)
  return { posts, featuredSlug: featuredOf(posts)?.slug }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  const posts = loaderData?.posts ?? []
  return buildMeta({
    title: 'Blog y recursos sobre control de plagas',
    description:
      'Conocimiento, prevención y soluciones para proteger la continuidad de tu empresa: guías de control de plagas para industrias, bodegas y comercios.',
    path: '/blog',
    // Sin artículos no se indexa
    noindex: posts.length === 0,
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog y recursos de Plagastop',
        inLanguage: 'es-CL',
      },
    ],
  })
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts, featuredSlug } = loaderData
  const featured = posts.find((p) => p.slug === featuredSlug)

  return (
    <>
      <PageHero
        crumbs={crumbs}
        title="Blog y recursos"
        lead="Conocimiento, prevención y soluciones para proteger la continuidad de tu empresa."
      />

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 'var(--s-8)' }}>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <h2>Pronto publicaremos guías y artículos</h2>
              <p className="lead">
                Mientras tanto, revisa nuestros servicios o consulta directamente con un especialista.
              </p>
              <ButtonLink to="/servicios" variant="secondary" arrow>
                Ver servicios
              </ButtonLink>
            </div>
          ) : (
            <>
              {featured && <FeaturedPost post={featured} />}
              <BlogExplorer posts={posts} featuredSlug={featuredSlug} />
            </>
          )}
        </div>
      </section>

      <BlogCta location="blog" />
    </>
  )
}
