/**
 * Fuente del blog. Las rutas (/blog, /blog/:slug, sitemap) y el prerender solo usan `blog`,
 * así que conectar WordPress no obliga a tocar rutas ni componentes.
 *
 * - Siempre se publican los artículos del sitio (lib/blog/local-posts.ts).
 * - Si WP_API_URL está definida, se suman los de WordPress. Si un artículo de WordPress tiene el mismo
 *   slug que uno del sitio, prevalece el de WordPress (así se puede migrar un artículo sin duplicarlo).
 *
 * Importa solo con rutas relativas: react-router.config.ts y routes.ts lo usan fuera de Vite.
 */

import { blogConfig } from './blog/config'
import { localSource } from './blog/local-posts'
import type { BlogPost, BlogSource } from './blog/types'
import { createWordPressSource } from './blog/wordpress'

export type { BlogCategory, BlogImage, BlogPost, BlogPostSummary, BlogSource } from './blog/types'
export { toSummary } from './blog/types'

function combine(sources: BlogSource[]): BlogSource {
  async function all() {
    const lists = await Promise.all(sources.map((s) => s.getPosts()))
    const bySlug = new Map<string, BlogPost>()
    // Las primeras fuentes tienen prioridad ante slugs repetidos
    for (const list of lists) for (const p of list) if (!bySlug.has(p.slug)) bySlug.set(p.slug, p)
    return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date))
  }
  return {
    async getPosts({ limit, category } = {}) {
      const posts = await all()
      const filtered = category ? posts.filter((p) => p.category.slug === category) : posts
      return limit ? filtered.slice(0, limit) : filtered
    },
    async getPost(slug) {
      return (await all()).find((p) => p.slug === slug)
    },
  }
}

export const blog: BlogSource = blogConfig.wpApiUrl
  ? combine([createWordPressSource(blogConfig.wpApiUrl), localSource])
  : localSource
