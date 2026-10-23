/**
 * Fuente WordPress headless: API REST pública (/wp-json/wp/v2), solo artículos publicados, sin credenciales.
 *
 * - Se piden con _embed para traer en la misma respuesta la imagen destacada, el autor y las categorías.
 * - Se recorren todas las páginas (X-WP-TotalPages) y se ordenan por fecha descendente.
 * - El HTML del contenido se sanitiza antes de llegar a la página.
 * - Si la API falla, el build falla con un mensaje claro: es preferible a publicar un blog vacío por error.
 *
 * Campos opcionales (plugins): Yoast SEO (yoast_head_json) para título y descripción; ACF para
 * servicio_relacionado e industria_relacionada (slugs del sitio). Sin ellos se usan valores por defecto.
 */

import type { BlogCategory, BlogImage, BlogPost, BlogSource } from './types'
import { blogConfig } from './config'
import { sanitizeHtml } from './sanitize'
import { decodeEntities, readingMinutes, stripHtml, truncate } from './utils'

interface WpMediaSize {
  source_url: string
  width: number
  height: number
}

interface WpPost {
  slug: string
  date_gmt: string
  modified_gmt: string
  sticky?: boolean
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  yoast_head_json?: { title?: string; description?: string }
  acf?: { servicio_relacionado?: string; industria_relacionada?: string }
  _embedded?: {
    author?: { name?: string }[]
    'wp:featuredmedia'?: {
      source_url?: string
      alt_text?: string
      media_details?: { width?: number; height?: number; sizes?: Record<string, WpMediaSize> }
    }[]
    'wp:term'?: { taxonomy: string; slug: string; name: string }[][]
  }
}

const UNCATEGORIZED: BlogCategory = { slug: 'general', name: 'General' }

/** Los campos *_gmt vienen sin zona: se marcan como UTC. */
const iso = (gmt: string) => `${gmt}Z`

function mapImage(post: WpPost, title: string): BlogImage | undefined {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media?.source_url) return undefined
  const sizes = Object.values(media.media_details?.sizes ?? {})
    .filter((s) => s.source_url && s.width)
    .sort((a, b) => a.width - b.width)
  const unique = sizes.filter((s, i) => sizes.findIndex((o) => o.width === s.width) === i)
  return {
    src: media.source_url,
    srcSet: unique.length ? unique.map((s) => `${s.source_url} ${s.width}w`).join(', ') : undefined,
    width: media.media_details?.width,
    height: media.media_details?.height,
    // Sin texto alternativo cargado en WordPress, se usa el título del artículo
    alt: media.alt_text?.trim() || title,
  }
}

function mapCategory(post: WpPost): BlogCategory {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  const category = terms.find((t) => t.taxonomy === 'category' && t.slug !== 'uncategorized' && t.slug !== 'sin-categoria')
  return category ? { slug: category.slug, name: decodeEntities(category.name) } : UNCATEGORIZED
}

/**
 * Autor solo si el "nombre público" de WordPress parece una persona (al menos dos palabras). Un nombre de
 * usuario como "Blogplagastop" se omite: entonces el autor es la organización (página y schema).
 */
function mapAuthor(post: WpPost) {
  const name = decodeEntities(post._embedded?.author?.[0]?.name?.trim() ?? '')
  return /\S+\s+\S+/.test(name) ? { name } : undefined
}

export function mapWpPost(post: WpPost): BlogPost {
  const title = decodeEntities(stripHtml(post.title.rendered))
  const html = sanitizeHtml(post.content.rendered)
  const excerpt = stripHtml(post.excerpt.rendered).replace(/\s*\[(?:…|&hellip;|\.\.\.)\]\s*$/, '…')
  return {
    slug: post.slug,
    title,
    excerpt,
    html,
    date: iso(post.date_gmt),
    modified: iso(post.modified_gmt),
    author: mapAuthor(post),
    category: mapCategory(post),
    image: mapImage(post, title),
    seo: {
      title: decodeEntities(post.yoast_head_json?.title?.replace(/\s*[|–-]\s*[^|–-]+$/, '') || title),
      description: truncate(post.yoast_head_json?.description || excerpt),
    },
    featured: Boolean(post.sticky),
    readingMinutes: readingMinutes(html),
    source: 'wordpress',
    relatedService: post.acf?.servicio_relacionado || undefined,
    relatedIndustry: post.acf?.industria_relacionada || undefined,
  }
}

interface WpCategory {
  slug: string
  name: string
  count: number
}

async function request(url: string, timeoutMs?: number) {
  let response: Response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
    })
  } catch (error) {
    throw new Error(`Blog: no se pudo conectar con WordPress (${url}): ${(error as Error).message}`, { cause: error })
  }
  if (!response.ok) throw new Error(`Blog: WordPress respondió ${response.status} en ${url}`)
  return response
}

/** Todos los artículos publicados (recorre todas las páginas), del más reciente al más antiguo. */
export async function fetchWpPosts(apiUrl: string, { maxPages = Infinity, timeoutMs }: { maxPages?: number; timeoutMs?: number } = {}) {
  const posts: BlogPost[] = []
  for (let page = 1, total = 1; page <= Math.min(total, maxPages); page++) {
    const url = `${apiUrl}/posts?_embed&orderby=date&order=desc&per_page=${blogConfig.wpPageSize}&page=${page}`
    const response = await request(url, timeoutMs)
    total = Number(response.headers.get('X-WP-TotalPages')) || 1
    const data = (await response.json()) as WpPost[]
    posts.push(...data.map(mapWpPost))
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

/** Un artículo por slug, o undefined si no existe o no está publicado. */
export async function fetchWpPost(apiUrl: string, slug: string, { timeoutMs }: { timeoutMs?: number } = {}) {
  const url = `${apiUrl}/posts?_embed&slug=${encodeURIComponent(slug)}`
  const data = (await (await request(url, timeoutMs)).json()) as WpPost[]
  return data[0] ? mapWpPost(data[0]) : undefined
}

/** Categorías de WordPress en su orden (por nombre), incluidas las que aún no tienen artículos. */
export async function fetchWpCategories(apiUrl: string, { timeoutMs }: { timeoutMs?: number } = {}) {
  const url = `${apiUrl}/categories?hide_empty=false&per_page=100&orderby=name&order=asc`
  const data = (await (await request(url, timeoutMs)).json()) as WpCategory[]
  return data
    .filter((c) => c.slug !== 'uncategorized' && c.slug !== 'sin-categoria')
    .map((c) => ({ slug: c.slug, name: decodeEntities(c.name) }))
}

export function createWordPressSource(apiUrl: string): BlogSource {
  // Un build pide cada lista una sola vez y la comparte entre /blog, cada artículo y el sitemap
  let posts: Promise<BlogPost[]> | undefined
  let categories: Promise<BlogCategory[]> | undefined

  return {
    async getPosts({ limit, category } = {}) {
      posts ??= fetchWpPosts(apiUrl)
      const all = await posts
      const filtered = category ? all.filter((p) => p.category.slug === category) : all
      return limit ? filtered.slice(0, limit) : filtered
    },
    async getPost(slug) {
      posts ??= fetchWpPosts(apiUrl)
      return (await posts).find((p) => p.slug === slug)
    },
    async getCategories() {
      categories ??= fetchWpCategories(apiUrl)
      return categories
    },
  }
}
