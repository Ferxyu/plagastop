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
  'desinfeccion-superficies': { alt: 'Técnico desinfectando superficies con amonio cuaternario', ratio: 3 / 4 },
  'sanitizacion-barco': { alt: 'Sanitización con bomba de espalda a bordo de un barco', ratio: 3 / 4 },
  'astillas-bodega-barco': { alt: 'Aspersión sobre astillas de pino en la bodega de un barco', ratio: 3 / 4 },
  'sede-fachada': {
    alt: 'Fachada de la sede de Plagastop en Concepción, con su techo verde',
    ratio: 16 / 9,
    focus: '40% 40%',
  },
  'termonebulizacion-bodega': { alt: 'Termonebulización en una bodega industrial vacía', ratio: 3 / 4 },
  'tratamiento-bodega-nave': { alt: 'Técnico aplicando tratamiento en la bodega de una nave', ratio: 3 / 4 },
  'galpon-cinta-transportadora': { alt: 'Tratamiento en la cinta transportadora de un galpón de graneles', ratio: 3 / 4 },
  'fumigacion-bajo-cobertor': { alt: 'Técnico prepara una fumigación bajo cobertor en una bodega de sacos', ratio: 3 / 4 },
  'termonebulizacion-silo': { alt: 'Técnico termonebulizando el interior de un silo', ratio: 3 / 4 },
  'bodega-n4': { alt: 'Bodega industrial con su portón cerrado durante un tratamiento', ratio: 3 / 4 },
  'graneles-bajo-cobertor': { alt: 'Graneles cubiertos con cobertor para fumigación', ratio: 3 / 4 },
  'patio-contenedores': { alt: 'Fila de contenedores abiertos en un patio de tratamiento', ratio: 4 / 3 },
  'fumigacion-contenedores': { alt: 'Contenedores conectados a equipos de fumigación', ratio: 16 / 9 },
  'nube-termonebulizacion': { alt: 'Nube de termonebulización avanzando por una bodega de graneles', ratio: 3 / 4 },
  'pasillo-nave': { alt: 'Técnico de Plagastop recorriendo el pasillo de cubierta de una nave', ratio: 3 / 4 },
  'silo-motobomba': { alt: 'Aspersión con motobomba en el exterior de un silo', ratio: 3 / 4 },
  'medidor-fumisense': { alt: 'Medición de gas con un detector FumiSense junto a un contenedor', ratio: 3 / 4 },
  'pallets-bajo-cobertor': { alt: 'Pallets de mercadería bajo cobertor en una bodega', ratio: 3 / 4 },
  'galpon-tecnico': { alt: 'Técnico de Plagastop trabajando dentro de un galpón de graneles', ratio: 3 / 4 },
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
