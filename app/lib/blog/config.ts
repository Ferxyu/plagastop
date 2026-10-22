/**
 * Configuración central del blog. Se lee al compilar (prerender), nunca en el navegador:
 * el sitio es estático y los artículos se incorporan al HTML en el build.
 *
 * Variable de entorno:
 * - WP_API_URL: raíz de la API REST de WordPress, p. ej. https://cms.plagastop.cl/wp-json/wp/v2
 *   Si está definida, los artículos de WordPress se publican junto con los del sitio (lib/blog/local-posts.ts).
 */

const env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}

export const blogConfig = {
  /** Sin barra final. */
  wpApiUrl: env.WP_API_URL?.trim().replace(/\/+$/, '') || undefined,
  /** Artículos por página al pedirlos a WordPress (máximo de la API: 100). */
  wpPageSize: 100,
  /** Tarjetas visibles en /blog antes de "Cargar más". */
  pageSize: 6,
}
