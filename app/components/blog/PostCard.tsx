import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { BlogPostSummary } from '~/lib/cms'
import { PostMeta } from './PostMeta'
import { PostImage } from './PostImage'
import styles from './blog.module.css'

/**
 * Tarjeta de artículo. Toda la tarjeta es clicable, pero el enlace real está en el título
 * (un solo enlace por tarjeta, con el título como texto accesible).
 */
export function PostCard({ post, headingLevel = 3 }: { post: BlogPostSummary; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const
  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        {post.image ? (
          <PostImage image={post.image} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 90vw" />
        ) : (
          <span className={styles.cardPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.category}>{post.category.name}</p>
        <Heading className={styles.cardTitle}>
          <Link to={`/blog/${post.slug}`} prefetch="intent" className={styles.cardLink}>
            {post.title}
          </Link>
        </Heading>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.cardFoot}>
          <PostMeta post={post} />
          <ArrowRight className={styles.cardArrow} size={18} strokeWidth={2} aria-hidden />
        </div>
      </div>
    </article>
  )
}
