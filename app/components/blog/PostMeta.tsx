import type { BlogPostSummary } from '~/lib/cms'
import { formatDate } from '~/lib/blog/utils'
import styles from './blog.module.css'

/** Fecha, tiempo de lectura y, si se pide, autor. */
export function PostMeta({ post, author }: { post: BlogPostSummary; author?: boolean }) {
  return (
    <p className={styles.meta}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min de lectura</span>
      {author && post.author && (
        <>
          <span aria-hidden>·</span>
          <span>{post.author.name}</span>
        </>
      )}
    </p>
  )
}

