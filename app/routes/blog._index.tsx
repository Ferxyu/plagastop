import { useEffect, useMemo, useState } from 'react'
import type { Route } from './+types/blog._index'
import { blog, mergePosts, toSummary, type BlogPostSummary } from '~/lib/cms'
import { blogConfig } from '~/lib/blog/config'
import { fetchLivePosts } from '~/lib/blog/live'
import { featuredOf } from '~/lib/blog/utils'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { Button, ButtonLink } from '~/components/ui/Button'
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
  const [posts, categories] = await Promise.all([blog.getPosts(), blog.getCategories()])
  return { posts: posts.map(toSummary), categories, wpApiUrl: blogConfig.wpApiUrl ?? null }
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

type Live = { posts: BlogPostSummary[] } | { error: true } | null

/**
 * Lista del build + lo publicado después en WordPress. La consulta en vivo ocurre tras hidratar
 * (el HTML estático no cambia, y los buscadores ven la lista del build). Si WordPress no responde,
 * se mantiene la lista del build sin avisos; solo se muestra un error si no hay nada que mostrar.
 */
function useLivePosts(built: BlogPostSummary[], apiUrl: string | null) {
  const [live, setLive] = useState<Live>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!apiUrl) return
    let active = true
    fetchLivePosts(apiUrl).then(
      (posts) => active && setLive({ posts }),
      () => active && setLive({ error: true }),
    )
    return () => {
      active = false
    }
  }, [apiUrl, attempt])

  const posts = useMemo(() => {
    if (!live || !('posts' in live)) return built
    // Lo vigente en WordPress manda: se quitan los de WordPress que ya no están publicados
    const published = new Set(live.posts.map((p) => p.slug))
    const kept = built.filter((p) => p.source !== 'wordpress' || published.has(p.slug))
    return mergePosts(live.posts, kept)
  }, [built, live])

  return {
    posts,
    loading: Boolean(apiUrl) && live === null,
    failed: Boolean(live && 'error' in live),
    retry: () => {
      setLive(null)
      setAttempt((a) => a + 1)
    },
  }
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { categories, wpApiUrl } = loaderData
  const { posts, loading, failed, retry } = useLivePosts(loaderData.posts, wpApiUrl)
  const featured = featuredOf(posts)

  return (
    <>
      <PageHero
        crumbs={crumbs}
        title="Blog y recursos"
        lead="Conocimiento, prevención y soluciones para proteger la continuidad de tu empresa."
      />

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 'var(--s-8)' }}>
          {posts.length > 0 ? (
            <>
              {featured && <FeaturedPost post={featured} />}
              <BlogExplorer posts={posts} categories={categories} featuredSlug={featured?.slug} />
            </>
          ) : loading ? (
            <div className={styles.empty} role="status">
              <h2>Cargando artículos…</h2>
            </div>
          ) : failed ? (
            <div className={styles.empty} role="alert">
              <h2>No pudimos cargar los artículos</h2>
              <p className="lead">Hubo un problema de conexión con el blog. Inténtalo de nuevo en unos segundos.</p>
              <Button type="button" variant="secondary" onClick={retry}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>Pronto publicaremos guías y artículos</h2>
              <p className="lead">
                Mientras tanto, revisa nuestros servicios o consulta directamente con un especialista.
              </p>
              <ButtonLink to="/servicios" variant="secondary" arrow>
                Ver servicios
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      <BlogCta location="blog" />
    </>
  )
}
