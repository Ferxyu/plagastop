/**
 * Landings de campaña (/lp/:slug). Sin navegación completa, noindex, una sola acción.
 * Una campaña nueva = una entrada aquí.
 */

export interface Landing {
  slug: string
  headline: string
  lead: string
  reasons: { title: string; text: string }[]
  /** Servicio que se precarga en el formulario. */
  service?: string
  industry?: string
}

export const landings: Landing[] = [
  {
    slug: 'control-de-plagas-empresas',
    headline: 'Control de plagas para empresas, con respaldo técnico de más de 25 años',
    lead: 'Programas preventivos y tratamientos para plantas, bodegas, empresas de alimentos y puertos. Desde Concepción, llegamos de Ñuble a Los Lagos.',
    reasons: [
      {
        title: 'Un plan para tu instalación',
        text: 'Inspeccionamos tu planta o bodega y definimos los puntos de control según el riesgo de cada zona.',
      },
      {
        title: 'Autorizados por el SAG',
        text: 'Resolución SAG 3273/2025 para tratamientos fitosanitarios oficiales de exportación e importación.',
      },
      {
        title: 'Cuatro décadas en terreno',
        text: 'Trabajamos en industrias y puertos del sur de Chile hace más de 25 años.',
      },
    ],
    service: 'manejo-integrado-de-plagas',
  },
]

export function getLanding(slug: string | undefined) {
  return landings.find((l) => l.slug === slug)
}
