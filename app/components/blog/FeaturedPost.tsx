import type { BlogPostSummary } from '~/lib/cms'
import { ButtonLink } from '~/components/ui/Button'
import { PostMeta } from './PostMeta'
import { PostImage } from './PostImage'
import styles from './blog.module.css'

/** Artículo destacado: imagen grande a un lado, texto y acción al otro. */
export function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <article className={styles.featured} aria-labelledby="destacado-title">
      <div className={styles.featuredMedia}>
        {post.image && <PostImage image={post.image} sizes="(min-width: 1000px) 55vw, 100vw" priority />}
      </div>
      <div className={styles.featuredBody}>
        <p className={styles.featuredLabel}>
          <span>Destacado</span>
          <span className={styles.category}>{post.category.name}</span>
        </p>
        <h2 id="destacado-title" className={styles.featuredTitle}>
          {post.title}
        </h2>
        <p className={styles.featuredExcerpt}>{post.excerpt}</p>
        <PostMeta post={post} />
        <ButtonLink to={`/blog/${post.slug}`} arrow>
          Leer artículo
        </ButtonLink>
      </div>
    </article>
  )
}
