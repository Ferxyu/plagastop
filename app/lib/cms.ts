/**
 * Fuente del blog. Las rutas (/blog, /blog/:slug, sitemap) y el prerender solo usan `blog`,
 * así que la conexión con WordPress no obliga a tocar rutas ni componentes.
 *
 * - WordPress headless (cms.plagastop.cl, API REST pública): fuente principal. Configurable con WP_API_URL.
 * - Artículos editoriales del sitio (lib/blog/local-posts.ts), si blogConfig.includeSitePosts.
 * Si un artículo de WordPress tiene el mismo slug que uno del sitio, prevalece el de WordPress.
 * Las categorías son las de WordPress; los artículos del sitio usan sus mismos slugs.
 *
 * Importa solo con rutas relativas: react-router.config.ts y routes.ts lo usan fuera de Vite.
 */

import { blogConfig } from './blog/config'
import { localSource } from './blog/local-posts'
import type { BlogCategory, BlogPost, BlogSource } from './blog/types'
import { createWordPressSource } from './blog/wordpress'

export type { BlogCategory, BlogImage, BlogPost, BlogPostSummary, BlogSource } from './blog/types'
export { toSummary } from './blog/types'

/** Une artículos por slug (gana el primero) y los ordena por fecha. */
export function mergePosts<T extends { slug: string; date: string }>(...lists: T[][]): T[] {
  const bySlug = new Map<string, T>()
  for (const list of lists) for (const p of list) if (!bySlug.has(p.slug)) bySlug.set(p.slug, p)
  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date))
}

/** Une categorías por slug (gana el nombre de la primera fuente) conservando el orden. */
export function mergeCategories(...lists: BlogCategory[][]): BlogCategory[] {
  const bySlug = new Map<string, BlogCategory>()
  for (const list of lists) for (const c of list) if (!bySlug.has(c.slug)) bySlug.set(c.slug, c)
  return [...bySlug.values()]
}

function combine(sources: BlogSource[]): BlogSource {
  async function categories() {
    return mergeCategories(...(await Promise.all(sources.map((s) => s.getCategories()))))
  }
  async function all() {
    const [lists, cats] = await Promise.all([Promise.all(sources.map((s) => s.getPosts())), categories()])
    // El nombre de la categoría siempre es el de WordPress, también en los artículos del sitio
    const names = new Map(cats.map((c) => [c.slug, c.name]))
    return mergePosts<BlogPost>(...lists).map((p) => ({
      ...p,
      category: { ...p.category, name: names.get(p.category.slug) ?? p.category.name },
    }))
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
    getCategories: categories,
  }
}

const sources = [
  ...(blogConfig.wpApiUrl ? [createWordPressSource(blogConfig.wpApiUrl)] : []),
  ...(blogConfig.includeSitePosts ? [localSource] : []),
]

export const blog: BlogSource = combine(sources)
