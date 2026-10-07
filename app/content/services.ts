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
  | 'home'

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
  /** Una línea: qué resuelve. */
  summary: string
  /** H1 de la página de servicio. */
  headline: string
  intro: string
  /** Situaciones de negocio en las que se necesita. */
  whenNeeded: string[]
  /** Alcance del servicio. */
  includes: string[]
  credentialIds?: string[]
  industries: string[]
  faqs?: ServiceFaq[]
  featured?: boolean
  /** Servicios secundarios no aparecen en el menú principal. */
  secondary?: boolean
  seo: { title: string; description: string }
}

export const services: Service[] = [
  {
    slug: 'manejo-integrado-de-plagas',
    name: 'Manejo Integrado de Plagas (MIP)',
    shortName: 'Manejo Integrado de Plagas',
    icon: 'mip',
    photo: 'estacion-control-interior',
    featured: true,
    summary:
      'Programa preventivo y periódico para mantener toda la instalación bajo control, con sanitización incluida.',
    headline: 'Manejo Integrado de Plagas para empresas e industrias',
    intro:
      'Un programa MIP no espera a que aparezca el problema. Combina inspección, monitoreo, control y registro en visitas periódicas, diseñadas para la operación real de cada instalación: sus accesos, sus zonas críticas y sus exigencias sanitarias.',
    whenNeeded: [
      'Tu planta o bodega debe demostrar control de plagas en auditorías o fiscalizaciones.',
      'Manipulas, almacenas o despachas alimentos y no puedes arriesgar la inocuidad.',
      'Quieres pasar de reaccionar ante cada aparición a prevenirla con un plan.',
    ],
    includes: [
      'Inspección inicial de la instalación y diagnóstico de riesgos.',
      'Plan de control con puntos de monitoreo definidos por zona.',
      'Visitas periódicas de control de insectos y roedores.',
      'Servicios periódicos de sanitización.',
      'Registro de cada visita para respaldar la gestión de calidad.',
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
        'Programas MIP con monitoreo, control y sanitización periódica para plantas, bodegas y empresas de alimentos en el sur de Chile. Plagastop, desde 1985.',
    },
  },
  {
    slug: 'control-de-roedores',
    name: 'Control de roedores',
    shortName: 'Control de roedores',
    icon: 'rodent',
    photo: 'control-roedores-captura',
    summary:
      'Monitoreo y control de roedores en perímetros, andenes, bodegas y zonas de proceso.',
    headline: 'Control de roedores para instalaciones industriales y comerciales',
    intro:
      'Los roedores contaminan mercadería, dañan instalaciones eléctricas y comprometen auditorías. El control se planifica desde el perímetro hacia el interior, cubriendo los puntos por donde realmente ingresan.',
    whenNeeded: [
      'Detectaste rastros o daños en mercadería, embalajes o cableado.',
      'Tu bodega o andén recibe carga de forma constante.',
      'Necesitas un control continuo y documentado para tu sistema de calidad.',
    ],
    includes: [
      'Inspección de perímetro, accesos y zonas de almacenamiento.',
      'Definición de puntos de control según el riesgo de cada zona.',
      'Control y seguimiento periódico.',
      'Recomendaciones de exclusión para cerrar vías de ingreso.',
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
        'Control y monitoreo de roedores para bodegas, centros logísticos, plantas de alimentos y comercio. Cobertura desde Ñuble hasta Los Lagos.',
    },
  },
  {
    slug: 'control-de-insectos',
    name: 'Control de insectos',
    shortName: 'Control de insectos',
    icon: 'insect',
    photo: 'desinsectacion-local-comercial',
    summary:
      'Control de insectos rastreros y voladores en cocinas, zonas de proceso y áreas comunes.',
    headline: 'Control de insectos para empresas de alimentos y comercio',
    intro:
      'Cucarachas, moscas y otros insectos son un riesgo directo para la inocuidad y la imagen de cualquier negocio. El control se ajusta al tipo de insecto, a la zona y al horario de operación para no interrumpir el trabajo.',
    whenNeeded: [
      'Operas cocinas, casinos o zonas de proceso de alimentos.',
      'Necesitas cumplir exigencias sanitarias en tu local o planta.',
      'Tienes una aparición activa que requiere respuesta y seguimiento.',
    ],
    includes: [
      'Inspección e identificación de focos.',
      'Tratamiento según el tipo de insecto y la zona.',
      'Seguimiento periódico para evitar reinfestaciones.',
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
    summary:
      'Control de microorganismos en superficies y ambientes de trabajo, como servicio puntual o periódico.',
    headline: 'Sanitización de instalaciones para empresas',
    intro:
      'La sanitización reduce la carga de microorganismos en superficies y ambientes. Complementa el control de plagas en instalaciones donde la higiene es parte del estándar de operación.',
    whenNeeded: [
      'Tu instalación maneja alimentos o recibe público de forma constante.',
      'Necesitas sanitizar después de un evento o antes de una auditoría.',
      'Quieres incorporar la sanitización a tu programa preventivo.',
    ],
    includes: [
      'Evaluación de zonas y superficies a tratar.',
      'Aplicación en ambientes y superficies de trabajo.',
      'Servicio puntual o integrado al programa MIP.',
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
    slug: 'fumigacion-de-granos-almacenados',
    name: 'Fumigación de granos almacenados',
    shortName: 'Granos almacenados',
    icon: 'grain',
    photo: 'silos-graneles',
    summary:
      'Programas para granos almacenados con laboratorio móvil, para proteger el valor del producto.',
    headline: 'Fumigación y programas para granos almacenados',
    intro:
      'Los insectos de granos almacenados deterioran el producto y su valor comercial. Plagastop trabaja programas específicos para granos almacenados, con apoyo de laboratorio móvil en terreno.',
    whenNeeded: [
      'Almacenas granos en silos, bodegas o celdas por períodos prolongados.',
      'Detectaste insectos o deterioro en el producto almacenado.',
      'Necesitas proteger la calidad del grano antes de su venta o despacho.',
    ],
    includes: [
      'Programa de control específico para granos almacenados.',
      'Laboratorio móvil en terreno.',
      'Tratamientos de fumigación según el tipo de almacenamiento.',
    ],
    industries: ['agroindustria-y-granos', 'puertos-y-comercio-exterior'],
    seo: {
      title: 'Fumigación de granos almacenados',
      description:
        'Programas de control y fumigación para granos almacenados en silos y bodegas, con laboratorio móvil. Plagastop, Concepción.',
    },
  },
  {
    slug: 'tratamientos-fitosanitarios-sag',
    name: 'Tratamientos fitosanitarios SAG',
    shortName: 'Tratamientos fitosanitarios SAG',
    icon: 'export',
    photo: 'aspersion-nave-polilla-gitana',
    summary:
      'Tratamientos oficiales para exportación e importación, autorizados por el SAG.',
    headline: 'Tratamientos fitosanitarios oficiales para exportación e importación',
    intro:
      'Los productos que cruzan fronteras deben cumplir exigencias fitosanitarias oficiales. Plagastop está autorizada por el Servicio Agrícola y Ganadero para ejecutarlas, y trabaja en los puertos de la zona desde 1985.',
    whenNeeded: [
      'Exportas o importas productos sujetos a tratamiento fitosanitario oficial.',
      'Tu carga requiere tratamiento antes del embarque o tras su llegada.',
      'Necesitas un proveedor autorizado por el SAG.',
    ],
    includes: [
      'Tratamientos fitosanitarios oficiales de exportación e importación.',
      'Ejecución por empresa autorizada (Res. SAG 2732/2021).',
      'Coordinación con la operación portuaria y logística.',
    ],
    credentialIds: ['sag'],
    industries: ['puertos-y-comercio-exterior', 'agroindustria-y-granos', 'forestal'],
    seo: {
      title: 'Tratamientos fitosanitarios SAG para exportación',
      description:
        'Tratamientos fitosanitarios oficiales de exportación e importación, autorizados por el SAG (Res. 2732/2021). Puertos del Biobío y sur de Chile.',
    },
  },
  {
    slug: 'medicion-de-gases-gas-free',
    name: 'Medición de gases residuales (Gas Free)',
    shortName: 'Medición Gas Free',
    icon: 'gas',
    photo: 'gas-free-contenedor',
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
    summary:
      'Control de plagas en instalaciones portuarias y naves, coordinado con la operación.',
    headline: 'Control de plagas en instalaciones portuarias y buques',
    intro:
      'Puertos y naves concentran carga, tránsito y exigencias sanitarias internacionales. Plagastop trabaja tratamientos en instalaciones portuarias y en buques, coordinados con los tiempos de la operación.',
    whenNeeded: [
      'Administras bodegas, patios o instalaciones dentro de un recinto portuario.',
      'Una nave requiere tratamiento durante su estadía en puerto.',
      'Necesitas un proveedor con experiencia en operación portuaria.',
    ],
    includes: [
      'Tratamientos en instalaciones portuarias.',
      'Tratamientos en buques.',
      'Coordinación con la operación y los tiempos de la nave.',
    ],
    industries: ['puertos-y-comercio-exterior'],
    seo: {
      title: 'Control de plagas en puertos y buques',
      description:
        'Tratamientos de control de plagas en instalaciones portuarias y naves en los puertos del Biobío y el sur de Chile. Plagastop, desde 1985.',
    },
  },
  {
    slug: 'control-de-plagas-residencial',
    name: 'Control de plagas residencial',
    shortName: 'Residencial',
    icon: 'home',
    photo: 'desinsectacion-exterior-casa',
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

export const primaryServices = services.filter((s) => !s.secondary)

export function getService(slug: string | undefined) {
  return services.find((s) => s.slug === slug)
}
