/**
 * Consultas a WordPress desde el navegador, para lo publicado después del último build:
 * - /blog suma los artículos nuevos al abrirse.
 * - /blog/:slug carga un artículo que todavía no tiene página estática.
 * La API es pública (CORS habilitado en WordPress para el dominio del sitio) y no usa credenciales.
 */

import { blogConfig } from './config'
import { toSummary, type BlogPostSummary } from './types'
import { fetchWpPost, fetchWpPosts } from './wordpress'

/** Los artículos más recientes de WordPress (una página: hasta 100). */
export async function fetchLivePosts(apiUrl = blogConfig.wpApiUrl): Promise<BlogPostSummary[]> {
  if (!apiUrl) return []
  const posts = await fetchWpPosts(apiUrl, { maxPages: 1, timeoutMs: blogConfig.clientTimeoutMs })
  return posts.map(toSummary)
}

export async function fetchLivePost(slug: string, apiUrl = blogConfig.wpApiUrl) {
  if (!apiUrl) return undefined
  return fetchWpPost(apiUrl, slug, { timeoutMs: blogConfig.clientTimeoutMs })
}
