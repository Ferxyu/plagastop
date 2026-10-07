/**
 * Fotografías reales de Plagastop (entregadas por el cliente, carpeta "imágenes plagastop").
 * Cada foto se exporta en dos o tres anchos a app/assets/photos/<slug>-<ancho>.jpg.
 */

const files = import.meta.glob<string>('../assets/photos/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export interface PhotoMeta {
  alt: string
  /** Proporción ancho / alto */
  ratio: number
  /** Punto focal para object-position */
  focus?: string
}

const meta = {
  'sede-concepcion': {
    alt: 'Sede de Plagastop en el Parque Industrial Ejército, Concepción',
    ratio: 2365 / 1330,
    focus: '30% 45%',
  },
  'estacion-control-interior': {
    alt: 'Estación de control de roedores instalada al interior de una bodega',
    ratio: 4 / 3,
  },
  'equipo-en-nave': { alt: 'Equipo de técnicos de Plagastop a bordo de una nave', ratio: 4 / 3 },
  'monitoreo-trampas-uv': {
    alt: 'Técnico revisa y cuenta insectos en la lámina de una trampa de luz ultravioleta',
    ratio: 3 / 4,
  },
  'control-roedores-captura': {
    alt: 'Técnico revisa una trampa de captura viva para roedores en terreno',
    ratio: 4 / 3,
  },
  'desinsectacion-local-comercial': {
    alt: 'Desinsectación con máquina de ultra bajo volumen en un local comercial',
    ratio: 3 / 4,
  },
  'sanitizacion-banos': { alt: 'Sanitización de baños y artefactos sanitarios', ratio: 4 / 3 },
  'silos-graneles': { alt: 'Tratamiento en el exterior de silos de graneles', ratio: 4 / 3 },
  'aspersion-nave-polilla-gitana': {
    alt: 'Aspersión cuarentenaria en la cubierta de una nave por polilla gitana',
    ratio: 4 / 3,
  },
  'gas-free-contenedor': {
    alt: 'Monitoreo de gas residual en un contenedor de importación',
    ratio: 4 / 3,
  },
  'tratamiento-buque': { alt: 'Técnico de Plagastop realizando un tratamiento a bordo de un buque', ratio: 4 / 3 },
  'desinsectacion-exterior-casa': { alt: 'Desinsectación en el exterior de una vivienda', ratio: 1200 / 720 },
  'fumigacion-molino': { alt: 'Preparación para la fumigación de un molino', ratio: 4 / 3 },
  'bodega-preventiva': { alt: 'Desinsectación preventiva de una bodega de graneles', ratio: 4 / 3 },
  'local-comercial': { alt: 'Desinsectación en un local comercial', ratio: 3 / 4, focus: '50% 60%' },
  'monitoreo-fosfina-barco': { alt: 'Monitoreo de gas fosfina en la bodega de un barco', ratio: 4 / 3 },
  'aspersion-exterior-silo': { alt: 'Aspersión con motobomba en el exterior de un silo', ratio: 4 / 3 },
  'astillas-de-pino': { alt: 'Aplicación sobre astillas de pino para exportación', ratio: 3 / 4 },
  'termonebulizacion-estructuras': {
    alt: 'Termonebulización de estructuras como tratamiento complementario a la fumigación',
    ratio: 4 / 3,
  },
  'medicion-fosfina-graneles': {
    alt: 'Técnico mide gas fosfina residual sobre la carga de graneles de una nave',
    ratio: 4 / 3,
  },
  'fumigacion-placas-degesch': {
    alt: 'Fumigación con placas Degesch y generador de fosfina',
    ratio: 3 / 4,
  },
  'detector-gas-residual': { alt: 'Detector digital de gas residual en terreno', ratio: 4 / 3 },
  'traslado-equipos-a-bordo': {
    alt: 'Traslado de máquinas y materiales a bordo de un barco',
    ratio: 3 / 4,
  },
} satisfies Record<string, PhotoMeta>

export type PhotoId = keyof typeof meta

export interface Photo extends PhotoMeta {
  src: string
  srcSet: string
}

/** Fotos de trabajo en terreno para acompañar páginas interiores sin repetir la del hero. */
const fieldPool: PhotoId[] = [
  'medicion-fosfina-graneles',
  'termonebulizacion-estructuras',
  'monitoreo-fosfina-barco',
  'detector-gas-residual',
  'fumigacion-placas-degesch',
  'equipo-en-nave',
  'aspersion-exterior-silo',
  'bodega-preventiva',
  'traslado-equipos-a-bordo',
]

/** Elige, de forma estable por página, una foto distinta a la del hero. */
export function secondaryPhoto(exclude: PhotoId, seed: string): PhotoId {
  const pool = fieldPool.filter((p) => p !== exclude)
  const hash = [...seed].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
  return pool[hash % pool.length]
}

export function photo(id: PhotoId): Photo {
  const variants = Object.entries(files)
    .map(([path, url]) => {
      const match = path.match(new RegExp(`/${id}-(\\d+)\\.jpg$`))
      return match ? { url, width: Number(match[1]) } : null
    })
    .filter((v): v is { url: string; width: number } => v !== null)
    .sort((a, b) => a.width - b.width)
  const largest = variants[variants.length - 1]
  return {
    ...meta[id],
    src: largest.url,
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(', '),
  }
}
