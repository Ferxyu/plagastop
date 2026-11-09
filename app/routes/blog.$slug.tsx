import { Link, data } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from './+types/blog.$slug'
import { blog, toSummary, type BlogImage } from '~/lib/cms'
import { relatedPosts, stripHtml } from '~/lib/blog/utils'
import { fetchLivePost, fetchLivePosts } from '~/lib/blog/live'
import { photo } from '~/content/photos'
import { getService } from '~/content/services'
import { blogPostingLd, breadcrumbLd, buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { PostMeta } from '~/components/blog/PostMeta'
import { PostImage } from '~/components/blog/PostImage'
import { PostCard } from '~/components/blog/PostCard'
import { BlogCta } from '~/components/blog/BlogCta'
import styles from '~/components/blog/blog.module.css'

/** Se ejecuta al compilar, una vez por artículo (ver prerender en react-router.config.ts). */
export async function loader({ params }: Route.LoaderArgs) {
  const post = await blog.getPost(params.slug)
  if (!post) throw data(null, { status: 404 })
  const related = relatedPosts(post, await blog.getPosts()).map(toSummary)
  return { post, related }
}

/**
 * En el navegador: los artículos del build traen sus datos estáticos (serverLoader). Si el artículo se
 * publicó en WordPress después del último build, no tiene página estática: se pide directo a la API.
 * Mientras carga se ve el HydrateFallback de root; si no existe, el 404 del sitio.
 */
export async function clientLoader({ params, serverLoader }: Route.ClientLoaderArgs) {
  try {
    return await serverLoader()
  } catch {
    const post = await fetchLivePost(params.slug)
    if (!post) throw data(null, { status: 404 })
    const latest = await fetchLivePosts().catch(() => [])
    return { post, related: relatedPosts(post, latest) }
  }
}

/** URL de la imagen para Open Graph y el schema (foto del sitio o imagen de WordPress). */
function imageUrl(image: BlogImage | undefined) {
  if (!image) return undefined
  return image.photo ? photo(image.photo).src : image.src
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [{ title: 'Artículo no encontrado | Plagastop' }]
  const { post } = loaderData
  const path = `/blog/${post.slug}`
  const image = imageUrl(post.image)
  return buildMeta({
    title: post.seo.title,
    description: post.seo.description,
    path,
    image,
    article: {
      published: post.date,
      modified: post.modified,
      section: post.category.name,
      author: post.author?.name,
      imageAlt: post.image?.alt,
    },
    jsonLd: [
      breadcrumbLd([
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]),
      blogPostingLd({
        slug: post.slug,
        title: post.title,
        description: post.seo.description,
        date: post.date,
        modified: post.modified,
        author: post.author?.name,
        section: post.category.name,
        image,
        wordCountText: stripHtml(post.html),
      }),
    ],
  })
}

export default function BlogPostPage({ loaderData }: Route.ComponentProps) {
  const { post, related } = loaderData
  const service = getService(post.relatedService)

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        title={post.title}
        lead={post.excerpt}
        actions={
          <div className={styles.articleHead}>
            <p className={styles.category}>{post.category.name}</p>
            <PostMeta post={post} author />
          </div>
        }
      />

      <section className="section">
        <div className={`container ${styles.articleLayout}`}>
          {post.image && (
            <figure className={styles.cover} style={{ width: '100%', margin: 0 }}>
              <PostImage image={post.image} sizes="(min-width: 1280px) 1280px, 100vw" priority />
            </figure>
          )}

          <Link to="/blog" className={styles.back} prefetch="intent">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden /> Volver al blog
          </Link>

          {/* HTML ya sanitizado al compilar (lib/blog/sanitize.ts) */}
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />

          {service && (
            <aside className={styles.related} aria-label="Servicios relacionados">
              <p>Para tu empresa</p>
              <Link to={`/servicios/${service.slug}`} prefetch="intent">
                {service.name} →
              </Link>
            </aside>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--paper" aria-labelledby="relacionados-title">
          <div className={`container ${styles.relatedGrid}`}>
            <SectionHeader id="relacionados-title" align="start" title="Artículos relacionados" />
            <ul className={styles.grid}>
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BlogCta location="blog_post" />
    </>
  )
}
