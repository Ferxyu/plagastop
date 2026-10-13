import type { PhotoId } from './photos'

/**
 * Industrias. Cada entrada genera /industrias/:slug, su pestaña en el explorador de la Home,
 * su opción en los formularios y el interlinking con servicios.
 * [Validar redacción con Plagastop]
 */

export interface Industry {
  slug: string
  name: string
  /** Etiqueta corta para selectores y pestañas. */
  label: string
  /** Cómo nombra el visitante su instalación ("mi bodega"). */
  facility: string
  headline: string
  intro: string
  risks: string[]
  services: string[]
  photo: PhotoId
  /** Foto del cuerpo de la página: distinta a la de la cabecera y del mismo rubro. */
  photo2: PhotoId
  seo: { title: string; description: string }
}

export const industries: Industry[] = [
  {
    slug: 'industria-alimentaria',
    name: 'Industria alimentaria',
    label: 'Alimentos',
    facility: 'Planta de alimentos',
    headline: 'Control de plagas para la industria alimentaria',
    intro:
      'En una planta de alimentos, una plaga no es solo una molestia: compromete la inocuidad, la certificación y la relación con cada cliente. El control se diseña zona por zona, desde la recepción hasta el despacho.',
    risks: [
      'Contaminación de materias primas y producto terminado.',
      'Hallazgos en auditorías de clientes o de la autoridad sanitaria.',
      'Ingreso de plagas junto con la mercadería recibida.',
    ],
    services: [
      'manejo-integrado-de-plagas',
      'control-de-roedores',
      'control-de-insectos',
      'sanitizacion',
    ],
    photo: 'fumigacion-molino',
    photo2: 'fumigacion-bajo-cobertor',
    seo: {
      title: 'Control de plagas para la industria alimentaria',
      description:
        'Programas MIP, control de roedores e insectos y sanitización para plantas de alimentos. Plagastop, desde Ñuble hasta Los Lagos.',
    },
  },
  {
    slug: 'bodegas-y-centros-logisticos',
    name: 'Bodegas y centros logísticos',
    label: 'Bodegas y logística',
    facility: 'Bodega o centro de distribución',
    headline: 'Control de plagas para bodegas y centros logísticos',
    intro:
      'Andenes abiertos, carga que entra y sale todo el día y grandes superficies de almacenamiento: las condiciones ideales para que una plaga entre sin que nadie lo note. El control parte en el perímetro y en los andenes.',
    risks: [
      'Daño a mercadería y embalajes almacenados.',
      'Roedores que ingresan con la carga o por portones abiertos.',
      'Reclamos de clientes por mercadería contaminada.',
    ],
    services: [
      'control-de-roedores',
      'manejo-integrado-de-plagas',
      'medicion-de-gases-gas-free',
    ],
    photo: 'bodega-preventiva',
    photo2: 'pallets-bajo-cobertor',
    seo: {
      title: 'Control de plagas para bodegas y centros logísticos',
      description:
        'Control de roedores y programas preventivos para bodegas, centros de distribución y operadores logísticos en el sur de Chile.',
    },
  },
  {
    slug: 'restaurantes-y-food-service',
    name: 'Restaurantes y food service',
    label: 'Restaurantes',
    facility: 'Restaurante, casino o cocina',
    headline: 'Control de plagas para restaurantes, casinos y food service',
    intro:
      'Una cocina se fiscaliza, se audita y la ven tus clientes. El control se ajusta a los horarios de servicio para no interrumpir la operación.',
    risks: [
      'Insectos rastreros en cocina y bodegas de insumos.',
      'Observaciones en fiscalizaciones sanitarias.',
      'Daño a la reputación ante clientes.',
    ],
    services: ['control-de-insectos', 'manejo-integrado-de-plagas', 'sanitizacion', 'control-de-roedores'],
    photo: 'desinsectacion-local-comercial',
    photo2: 'local-comercial',
    seo: {
      title: 'Control de plagas para restaurantes y casinos',
      description:
        'Control de insectos, roedores y sanitización para restaurantes, casinos y cocinas industriales en Concepción y el sur de Chile.',
    },
  },
  {
    slug: 'puertos-y-comercio-exterior',
    name: 'Puertos y comercio exterior',
    label: 'Puertos',
    facility: 'Terminal o carga de comercio exterior',
    headline: 'Control de plagas y tratamientos para puertos y comercio exterior',
    intro:
      'Plagastop nació trabajando en los puertos de la VIII Región. Hoy ejecuta tratamientos fitosanitarios oficiales autorizados por el SAG, mide gases residuales en contenedores y naves, y trata instalaciones portuarias y buques.',
    risks: [
      'Carga retenida por no cumplir exigencias fitosanitarias.',
      'Gases residuales en contenedores fumigados en origen.',
      'Plagas en bodegas y naves durante la estadía en puerto.',
    ],
    services: [
      'tratamientos-fitosanitarios-sag',
      'medicion-de-gases-gas-free',
      'tratamientos-portuarios-y-buques',
      'fumigacion-de-granos-almacenados',
    ],
    photo: 'monitoreo-fosfina-barco',
    photo2: 'patio-contenedores',
    seo: {
      title: 'Tratamientos para puertos y comercio exterior',
      description:
        'Tratamientos fitosanitarios SAG, medición Gas Free y control de plagas en puertos y buques del Biobío. Plagastop, desde 1985.',
    },
  },
  {
    slug: 'agroindustria-y-granos',
    name: 'Agroindustria y granos',
    label: 'Agroindustria',
    facility: 'Planta de granos o agroindustria',
    headline: 'Control de plagas para agroindustria y granos almacenados',
    intro:
      'El grano almacenado pierde valor cada día que una plaga avanza. Plagastop trabaja programas para granos almacenados con laboratorio móvil, además de tratamientos fitosanitarios para exportación.',
    risks: [
      'Insectos de almacén que deterioran el grano.',
      'Pérdida de calidad y valor comercial del producto.',
      'Exigencias fitosanitarias para exportar.',
    ],
    services: [
      'fumigacion-de-granos-almacenados',
      'tratamientos-fitosanitarios-sag',
      'control-de-roedores',
      'manejo-integrado-de-plagas',
    ],
    photo: 'aspersion-exterior-silo',
    photo2: 'graneles-bajo-cobertor',
    seo: {
      title: 'Control de plagas para agroindustria y granos',
      description:
        'Fumigación de granos almacenados con laboratorio móvil, tratamientos fitosanitarios SAG y control de roedores para la agroindustria.',
    },
  },
  {
    slug: 'forestal',
    name: 'Forestal',
    label: 'Forestal',
    facility: 'Planta o cancha forestal',
    headline: 'Tratamientos y control de plagas para la industria forestal',
    intro:
      'La madera que se exporta debe cumplir exigencias fitosanitarias oficiales. Plagastop ejecuta tratamientos autorizados por el SAG y programas preventivos para las instalaciones forestales.',
    risks: [
      'Exigencias fitosanitarias de los mercados de destino.',
      'Plagas en bodegas de insumos e instalaciones de proceso.',
    ],
    services: ['tratamientos-fitosanitarios-sag', 'manejo-integrado-de-plagas', 'control-de-roedores'],
    photo: 'astillas-de-pino',
    photo2: 'astillas-bodega-barco',
    seo: {
      title: 'Tratamientos fitosanitarios para la industria forestal',
      description:
        'Tratamientos fitosanitarios SAG y control de plagas para plantas y canchas forestales en el Biobío y el sur de Chile.',
    },
  },
  {
    slug: 'plantas-industriales',
    name: 'Plantas industriales',
    label: 'Industria',
    facility: 'Planta industrial',
    headline: 'Control de plagas para plantas industriales y productivas',
    intro:
      'En una planta productiva, un roedor en una sala eléctrica puede detener la operación. El control se planifica según los puntos críticos de cada instalación.',
    risks: [
      'Daño a cableado, tableros y equipos.',
      'Plagas en casinos, vestidores y bodegas de insumos.',
      'Exigencias de prevención y de los mandantes.',
    ],
    services: ['manejo-integrado-de-plagas', 'control-de-roedores', 'control-de-insectos', 'sanitizacion'],
    photo: 'termonebulizacion-estructuras',
    photo2: 'galpon-cinta-transportadora',
    seo: {
      title: 'Control de plagas para plantas industriales',
      description:
        'Programas preventivos, control de roedores e insectos y sanitización para plantas productivas en el sur de Chile.',
    },
  },
  {
    slug: 'comercio-y-retail',
    name: 'Comercio y retail',
    label: 'Comercio',
    facility: 'Local comercial o supermercado',
    headline: 'Control de plagas para comercio y retail',
    intro:
      'Salas de venta, bodegas y patios de carga reciben público y mercadería todos los días. El control protege el producto y la imagen frente a cada cliente.',
    risks: [
      'Plagas visibles para los clientes.',
      'Mercadería dañada en bodega.',
      'Ingreso por patios de carga.',
    ],
    services: ['manejo-integrado-de-plagas', 'control-de-roedores', 'control-de-insectos', 'sanitizacion'],
    photo: 'local-comercial',
    photo2: 'bodega-n4',
    seo: {
      title: 'Control de plagas para comercio y retail',
      description:
        'Control de plagas y sanitización para locales comerciales, supermercados y retail en Concepción y el sur de Chile.',
    },
  },
]

export function getIndustry(slug: string | undefined) {
  return industries.find((i) => i.slug === slug)
}
