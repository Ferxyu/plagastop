/**
 * Servicios. Cada entrada genera su página (/servicios/:slug), su fila en la leyenda,
 * sus opciones de formulario, su schema Service y el interlinking con industrias.
 *
 * Contenido descriptivo redactado a partir de plagastop.cl. [Validar redacción con Plagastop]
 */

import type { PhotoId } from './photos'

export type ServiceIconName =
  | 'mip'
  | 'rodent'
  | 'insect'
  | 'sanitize'
  | 'grain'
  | 'export'
  | 'gas'
  | 'port'
  | 'wood'
  | 'home'
  | 'acid'
  | 'bird'

/** Punto de "Qué incluye" con varias opciones listadas en un mismo recuadro. */
export interface ServiceIncludeGroup {
  title: string
  items: string[]
}

export interface ServiceFaq {
  q: string
  a: string
}

export interface Service {
  slug: string
  name: string
  shortName: string
  icon: ServiceIconName
  photo: PhotoId
  /** Foto del cuerpo de la página: distinta a la de la cabecera y del mismo servicio. */
  photo2: PhotoId
  /** Foto de la banda de cierre "Cotiza…": otra escena del mismo servicio. */
  closingPhoto: PhotoId
  /** Primera frase de la banda "Cotiza…" cuando no aplica la genérica. */
  closingLead?: string
  /** Fotos adicionales del servicio en terreno. */
  gallery?: PhotoId[]
  /** Una línea: qué resuelve. */
  summary: string
  /** H1 de la página de servicio. */
  headline: string
  intro: string
  /** Situaciones de negocio en las que se necesita. */
  whenNeeded: string[]
  /** Alcance del servicio. */
  includes: (string | ServiceIncludeGroup)[]
  credentialIds?: string[]
  industries: string[]
  faqs?: ServiceFaq[]
  featured?: boolean
  /** Servicios secundarios no aparecen en el menú principal. */
  secondary?: boolean
  seo: { title: string; description: string }
}

const serviceList: Service[] = [
  {
    slug: 'manejo-integrado-de-plagas',
    name: 'Manejo Integrado de Plagas (MIP)',
    shortName: 'Manejo Integrado de Plagas',
    icon: 'mip',
    photo: 'mip-perimetro-planta',
    photo2: 'galpon-tecnico',
    closingPhoto: 'mip-monitoreo-exterior',
    summary:
      'Programa preventivo y periódico para mantener toda la instalación bajo control, con sanitización incluida.',
    headline: 'Manejo Integrado de Plagas para empresas e industrias',
    intro:
      'Un programa MIP no espera a que aparezca el problema. Combina inspección, monitoreo, control y registro en visitas periódicas, diseñadas para la operación real de cada instalación: sus accesos, sus zonas críticas y sus exigencias sanitarias.',
    whenNeeded: [
      'Necesitas cumplir con la normativa sanitaria vigente.',
      'Manipulas, almacenas o despachas alimentos y no puedes arriesgar la inocuidad.',
      'Quieres pasar de reaccionar ante cada aparición a prevenirla con un plan.',
    ],
    includes: [
      'Inspección inicial de la instalación y diagnóstico de riesgos.',
      'Plan de control con puntos de monitoreo definidos por zona.',
      'Visitas periódicas de control de roedores, sanitización y desinsectación.',
      'Servicios periódicos de sanitización.',
      'Registro de cada visita para respaldar la prestación del servicio.',
      'Emisión de certificación del servicio.',
    ],
    industries: [
      'industria-alimentaria',
      'restaurantes-y-food-service',
      'bodegas-y-centros-logisticos',
      'plantas-industriales',
      'comercio-y-retail',
    ],
    faqs: [
      {
        q: '¿Qué diferencia hay entre un programa MIP y una fumigación puntual?',
        a: 'Una fumigación resuelve un evento. Un programa MIP es continuo: inspecciona, monitorea y controla de forma periódica para evitar que el problema aparezca, y deja registro de cada visita.',
      },
    ],
    seo: {
      title: 'Manejo Integrado de Plagas (MIP) para empresas',
      description:
        'Programas MIP con monitoreo, control y sanitización periódica para plantas, bodegas y empresas de alimentos en el sur de Chile. Plagastop, más de 25 años de experiencia.',
    },
  },
  {
    slug: 'control-de-roedores',
    name: 'Control de roedores',
    shortName: 'Control de roedores',
    icon: 'rodent',
    photo: 'roedores-estacion-perimetro',
    photo2: 'estacion-control-interior',
    closingPhoto: 'pallets-bajo-cobertor',
    summary:
      'Monitoreo y control de roedores en perímetros, andenes, bodegas y zonas de proceso.',
    headline: 'Control de roedores para instalaciones industriales y comerciales',
    intro:
      'Los roedores, siendo vectores de enfermedades, contaminan las instalaciones y ponen en riesgo la salud de las personas.',
    whenNeeded: [
      'Detectaste signos o daños en mercancía, embalajes o cableado.',
      'Tu instalación recibe carga de forma constante.',
      'Necesitas un control continuo y documentado para cumplir la normativa sanitaria vigente.',
      'Previo a actividades de descarpe (movimientos de tierra).',
      'Tratamientos predemolición (visado por la SEREMI de Salud).',
    ],
    includes: [
      'Inspección de perímetro, accesos y zonas de almacenamiento.',
      'Definición de puntos de control según el riesgo de cada zona.',
      'Control, seguimiento y recomendaciones.',
      'Emisión de certificación del servicio.',
    ],
    industries: [
      'bodegas-y-centros-logisticos',
      'industria-alimentaria',
      'agroindustria-y-granos',
      'puertos-y-comercio-exterior',
      'plantas-industriales',
      'comercio-y-retail',
    ],
    seo: {
      title: 'Control de roedores para empresas',
      description:
        'Control y monitoreo de roedores para bodegas, centros logísticos, plantas de alimentos y comercio. Desde Concepción, llegamos de Ñuble a Los Lagos.',
    },
  },
  {
    slug: 'control-de-insectos',
    name: 'Control de insectos',
    shortName: 'Control de insectos',
    icon: 'insect',
    photo: 'insectos-oficina-aplicacion',
    photo2: 'insectos-cocina-aplicacion',
    closingPhoto: 'monitoreo-trampas-uv',
    summary:
      'Control de insectos rastreros y voladores en cocinas, zonas de proceso y áreas comunes.',
    headline: 'Control de insectos para empresas de alimentos y comercio',
    intro:
      'Siendo los insectos un riesgo directo para la inocuidad y la imagen de cualquier negocio, el control se ajusta según la especie detectada en la evaluación inicial.',
    whenNeeded: [
      'Necesitas cumplir exigencias sanitarias establecidas por el MINSAL.',
      'Presentas zonas sensibles que requieren un control periódico.',
      'Tienes una aparición activa que requiere respuesta y seguimiento.',
    ],
    includes: [
      'Inspección e identificación de focos.',
      'Tratamiento según el tipo de insecto y la zona.',
      'Seguimiento periódico para evitar reinfestaciones.',
      'Monitoreo de insectos a través del uso de trampas ultravioleta.',
      'Emisión de certificación del servicio.',
    ],
    industries: [
      'restaurantes-y-food-service',
      'industria-alimentaria',
      'comercio-y-retail',
      'plantas-industriales',
    ],
    seo: {
      title: 'Control de insectos para empresas',
      description:
        'Control de cucarachas, moscas e insectos rastreros y voladores para restaurantes, plantas de alimentos y comercio en el sur de Chile.',
    },
  },
  {
    slug: 'sanitizacion',
    name: 'Sanitización',
    shortName: 'Sanitización',
    icon: 'sanitize',
    photo: 'sanitizacion-banos',
    photo2: 'sanitizacion-lavamanos',
    closingPhoto: 'sanitizacion-vitrina',
    summary:
      'Control de microorganismos en superficies y ambientes de trabajo, como servicio puntual o periódico.',
    headline: 'Sanitización de instalaciones para empresas',
    intro:
      'La sanitización reduce la carga de microorganismos a un nivel seguro en superficies y ambientes. Complementa el control de plagas en instalaciones donde la higiene es parte del estándar de operación.',
    whenNeeded: [
      'Para controlar brotes de cargas infecciosas en el lugar de trabajo.',
      'Por cumplimiento de la normativa sanitaria.',
      'Quieres incorporar la sanitización a tu programa preventivo.',
      'Al momento de habilitar el uso de un estanque de agua potable.',
    ],
    includes: [
      'Evaluación de zonas y superficies a tratar.',
      'Aplicación ambiental y en superficies de trabajo.',
      'Servicio puntual o integrado al programa MIP.',
      'Emisión de certificación.',
    ],
    industries: [
      'industria-alimentaria',
      'restaurantes-y-food-service',
      'comercio-y-retail',
      'plantas-industriales',
    ],
    seo: {
      title: 'Sanitización de instalaciones para empresas',
      description:
        'Sanitización de ambientes y superficies para plantas de alimentos, restaurantes, comercio e industria. Servicio puntual o periódico.',
    },
  },
  {
    // Servicio indicado por Plagastop (octubre 2026). [Validar redacción con Plagastop]
    slug: 'control-de-aves',
    name: 'Control de aves',
    shortName: 'Control de aves',
    icon: 'bird',
    photo: 'aves-bandada',
    photo2: 'aves-paloma-malla',
    closingPhoto: 'aves-paloma-pasto',
    summary: 'Control y monitoreo de aves que dañan la mercancía y las instalaciones.',
    headline: 'Control de aves para instalaciones industriales y comerciales',
    intro:
      'Las aves dañinas ocasionan daño a la mercancía y a las instalaciones. El control combina monitoreo, captura viva, retiro de nidos y disposición final, con certificación del servicio.',
    whenNeeded: [
      'Ante la presencia de aves dañinas que ocasionan daño a la mercancía y a las instalaciones.',
    ],
    includes: [
      'Control y monitoreo por impacto.',
      'Instalación de trampas de captura viva.',
      'Retiro de nidos y aplicación de repelente.',
      'Disposición final.',
      'Emisión de certificación.',
    ],
    industries: ['bodegas-y-centros-logisticos', 'agroindustria-y-granos', 'puertos-y-comercio-exterior'],
    seo: {
      title: 'Control de aves para empresas',
      description:
        'Control y monitoreo de aves en bodegas, plantas e instalaciones portuarias: trampas de captura viva, retiro de nidos, repelente y disposición final, con certificación.',
    },
  },
  {
    slug: 'fumigacion-de-granos-almacenados',
    name: 'Fumigación de granos almacenados',
    shortName: 'Granos almacenados',
    icon: 'grain',
    photo: 'silos-graneles',
    photo2: 'termonebulizacion-silo',
    closingPhoto: 'fumigacion-placas-degesch',
    featured: true,
    summary:
      'Programas para granos almacenados, con análisis del grado de infestación, para proteger el valor del producto.',
    headline: 'Fumigación y programas para granos almacenados',
    intro:
      'Los insectos de granos almacenados deterioran el producto y su valor comercial. Plagastop trabaja programas específicos para granos almacenados, con análisis interno del grado de infestación.',
    whenNeeded: [
      'Almacenas granos en silos o bodegas por períodos prolongados.',
      'Detectaste insectos o deterioro en el producto almacenado.',
      'Necesitas proteger la calidad del grano antes de su venta o despacho.',
    ],
    includes: [
      'Programa de control específico para granos almacenados.',
      'Análisis en terreno de grado de infestación de granos.',
      'Fumigación con fosfina.',
      'Emisión de certificación.',
    ],
    industries: ['agroindustria-y-granos', 'puertos-y-comercio-exterior'],
    seo: {
      title: 'Fumigación de granos almacenados',
      description:
        'Programas de control y fumigación para granos almacenados en silos y bodegas, con análisis del grado de infestación. Plagastop, Concepción.',
    },
  },
  {
    // Especialidad indicada por Plagastop (octubre 2026). [Validar redacción con Plagastop]
    slug: 'pulverizacion-de-astillas-de-madera',
    name: 'Pulverización de astillas de madera',
    shortName: 'Astillas de madera',
    icon: 'wood',
    photo: 'astillas-bodega-barco',
    photo2: 'astillas-de-pino',
    closingPhoto: 'tratamiento-bodega-nave',
    closingLead: 'Recintos portuarios a lo largo del país.',
    featured: true,
    summary: 'Pulverizado de astillas de madera en buques y plantas de origen.',
    headline: 'Pulverizado de astillas de madera en buques y plantas de origen',
    intro:
      'Las astillas de madera de exportación se tratan en su planta de origen o en las bodegas del buque. Plagastop realiza el pulverizado de la carga en ambos puntos.',
    whenNeeded: [
      'Exportas astillas de madera a mercados que lo requieren.',
    ],
    includes: [
      'Pulverizado de astillas de madera en bodegas de buques.',
      'Pulverizado de astillas de madera en plantas de origen.',
      'Emisión de certificación.',
    ],
    industries: ['forestal', 'puertos-y-comercio-exterior'],
    seo: {
      title: 'Pulverizado de astillas de madera en buques y plantas de origen',
      description:
        'Pulverizado de astillas de madera de exportación en buques y plantas de origen, en los puertos del Biobío y el sur de Chile. Plagastop, más de 25 años de experiencia.',
    },
  },
  {
    slug: 'tratamientos-fitosanitarios-sag',
    name: 'Tratamientos fitosanitarios SAG',
    shortName: 'Tratamientos fitosanitarios SAG',
    icon: 'export',
    photo: 'aspersion-nave-polilla-gitana',
    photo2: 'fumigacion-contenedores',
    closingPhoto: 'patio-contenedores',
    summary:
      'Tratamientos oficiales para exportación e importación, autorizados por el SAG.',
    headline: 'Tratamientos fitosanitarios oficiales de exportación e importación',
    intro:
      'Los productos que cruzan fronteras deben cumplir exigencias fitosanitarias oficiales. Plagastop está autorizada por el Servicio Agrícola y Ganadero para ejecutarlas, y trabaja en los pasos fronterizos a lo largo del país hace más de 25 años.',
    whenNeeded: [
      'Tu mercancía requiere tratamiento fitosanitario oficial de importación o exportación.',
      'Necesitas un profesional del área específica autorizado por el SAG.',
    ],
    includes: [
      'Tratamientos fitosanitarios oficiales de exportación, importación y tránsito.',
      {
        title: 'Tipos de tratamiento',
        items: [
          'Fumigación con bromuro de metilo',
          'Fumigación con fosfina',
          'Desinfección y desinfestación',
          'Destrucciones',
        ],
      },
      'Emisión de certificación de tratamiento.',
    ],
    credentialIds: ['sag'],
    industries: ['puertos-y-comercio-exterior', 'agroindustria-y-granos', 'forestal'],
    seo: {
      title: 'Tratamientos fitosanitarios SAG para exportación',
      description:
        'Tratamientos fitosanitarios oficiales de exportación, importación y tránsito, autorizados por el SAG (Res. 3273/2025), en pasos fronterizos a lo largo del país.',
    },
  },
  {
    // Servicio indicado por Plagastop (octubre 2026). [Validar redacción con Plagastop]
    slug: 'tratamiento-acido-propionico',
    name: 'Tratamiento con ácido propiónico para control de salmonela',
    shortName: 'Ácido propiónico',
    icon: 'acid',
    photo: 'acido-propionico-galpon',
    photo2: 'acido-propionico-aplicacion',
    closingPhoto: 'acido-propionico-tambor',
    summary: 'Aplicación de ácido propiónico en harinas industriales a granel para el control de salmonela.',
    headline: 'Tratamiento con ácido propiónico para control de salmonela en harinas industriales',
    intro:
      'Plagastop aplica ácido propiónico en harinas industriales a granel para el control de salmonela y otros agentes microbianos, y certifica cada aplicación.',
    whenNeeded: [
      'Para inspecciones fitosanitarias realizadas por el SAG y la detección de salmonela y otros agentes microbianos.',
    ],
    includes: [
      'Aplicación de ácido propiónico (propanoico) en harinas a granel.',
      'Certificado de aplicación de pesticidas.',
    ],
    industries: ['agroindustria-y-granos', 'plantas-industriales'],
    seo: {
      title: 'Tratamiento con ácido propiónico para control de salmonela',
      description:
        'Aplicación de ácido propiónico en harinas industriales a granel para el control de salmonela y otros agentes microbianos, con certificado de aplicación. Plagastop, Concepción.',
    },
  },
  {
    slug: 'medicion-de-gases-gas-free',
    name: 'Medición de gases residuales (Gas Free)',
    shortName: 'Medición Gas Free',
    icon: 'gas',
    photo: 'gas-free-cubierta-nave',
    photo2: 'medidor-fumisense',
    closingPhoto: 'medicion-fosfina-graneles',
    closingLead: 'Recintos portuarios a lo largo del país.',
    gallery: ['gas-free-fosfina-granel', 'gas-free-escotilla-nave', 'gas-free-detector-granos'],
    summary:
      'Medición de gases residuales en contenedores y naves antes de su apertura o descarga.',
    headline: 'Medición de gases residuales Gas Free en contenedores y naves',
    intro:
      'Un contenedor o una bodega de nave fumigada puede conservar gases residuales. La medición Gas Free verifica las condiciones antes de que las personas ingresen o manipulen la carga.',
    whenNeeded: [
      'Recibes contenedores o carga que fue fumigada en origen.',
      'Tu operación portuaria necesita verificar condiciones antes de la descarga.',
      'Debes resguardar la seguridad de quienes abren y manipulan la carga.',
    ],
    includes: [
      'Medición de gases residuales en contenedores.',
      'Medición en bodegas de naves.',
      'Registro de la medición realizada.',
      'Emisión de certificación.',
    ],
    industries: ['puertos-y-comercio-exterior', 'bodegas-y-centros-logisticos'],
    seo: {
      title: 'Medición Gas Free en contenedores y naves',
      description:
        'Medición de gases residuales (Gas Free) en contenedores y bodegas de naves para operar con seguridad. Plagastop, puertos del Biobío.',
    },
  },
  {
    slug: 'tratamientos-portuarios-y-buques',
    name: 'Tratamientos portuarios y en buques',
    shortName: 'Puertos y buques',
    icon: 'port',
    photo: 'tratamiento-buque',
    photo2: 'pasillo-nave',
    closingPhoto: 'equipo-en-nave',
    closingLead: 'Recintos portuarios a lo largo del país.',
    featured: true,
    summary: 'Control de plagas en instalaciones portuarias y naves.',
    headline: 'Control de plagas en instalaciones portuarias y buques',
    intro:
      'Puertos y naves concentran carga, tránsito y exigencias sanitarias internacionales. Plagastop trabaja tratamientos en instalaciones portuarias y en buques.',
    whenNeeded: [
      'Administras bodegas, patios o instalaciones dentro de un recinto portuario.',
      'Una nave requiere tratamiento antes de su estadía en puerto.',
      'Necesitas un proveedor con experiencia en operación portuaria.',
    ],
    includes: [
      'Tratamientos en instalaciones portuarias.',
      'Tratamientos en buques.',
      'Emisión de certificación.',
    ],
    industries: ['puertos-y-comercio-exterior'],
    seo: {
      title: 'Control de plagas en puertos y buques',
      description:
        'Tratamientos de control de plagas en instalaciones portuarias y naves en los puertos del Biobío y el sur de Chile. Plagastop, más de 25 años de experiencia.',
    },
  },
  {
    slug: 'control-de-plagas-residencial',
    name: 'Control de plagas residencial',
    shortName: 'Residencial',
    icon: 'home',
    photo: 'desinsectacion-exterior-casa',
    photo2: 'desinfeccion-superficies',
    closingPhoto: 'local-comercial',
    secondary: true,
    summary: 'Control de plagas para casas, departamentos y condominios.',
    headline: 'Control de plagas residencial',
    intro:
      'Aunque trabajamos principalmente con empresas, también atendemos hogares y condominios con el mismo estándar técnico.',
    whenNeeded: [
      'Detectaste roedores o insectos en tu casa o departamento.',
      'Administras un condominio y necesitas control en espacios comunes.',
    ],
    includes: [
      'Inspección y diagnóstico.',
      'Tratamiento según la plaga detectada.',
      'Recomendaciones de prevención.',
    ],
    industries: [],
    seo: {
      title: 'Control de plagas residencial en Concepción',
      description:
        'Control de roedores e insectos para casas, departamentos y condominios en el Gran Concepción y el sur de Chile.',
    },
  },
]

/**
 * Las especialidades (featured: granos almacenados, astillas de madera, puertos y buques) van primero,
 * así encabezan el menú, el home y los listados.
 */
export const services: Service[] = [
  ...serviceList.filter((s) => s.featured),
  ...serviceList.filter((s) => !s.featured),
]

export const primaryServices = services.filter((s) => !s.secondary)

export function getService(slug: string | undefined) {
  return services.find((s) => s.slug === slug)
}
