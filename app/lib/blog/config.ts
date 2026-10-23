/**
 * Configuración central del blog.
 *
 * WordPress headless: la API REST pública de cms.plagastop.cl, sin credenciales.
 * - Al compilar, WP_API_URL (variable de entorno) permite apuntar a otra instalación; 'off' la desactiva.
 * - En el navegador (artículos publicados después del último build) se usa la URL por defecto,
 *   o la que entregue el loader de /blog.
 */

/** Raíz de la API REST de WordPress (sin barra final). */
export const DEFAULT_WP_API_URL = 'https://cms.plagastop.cl/wp-json/wp/v2'

const env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}

function wpApiUrl() {
  const value = env.WP_API_URL?.trim()
  if (value === 'off') return undefined
  return (value || DEFAULT_WP_API_URL).replace(/\/+$/, '')
}

export const blogConfig = {
  wpApiUrl: wpApiUrl(),
  /**
   * Artículos editoriales del sitio (lib/blog/local-posts.ts): contenido real con fuentes, publicado
   * desde el código. Se muestran junto con los de WordPress; poner en false para mostrar solo WordPress.
   */
  includeSitePosts: true,
  /** Artículos por página al pedirlos a WordPress (máximo de la API: 100). */
  wpPageSize: 100,
  /** Tiempo máximo de espera de la API en el navegador. */
  clientTimeoutMs: 10000,
  /** Tarjetas visibles en /blog antes de "Cargar más". */
  pageSize: 6,
}
