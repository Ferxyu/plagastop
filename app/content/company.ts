/**
 * Datos de empresa. Fuente: plagastop.cl (2026) y confirmaciones directas de Plagastop.
 * Todo lo publicado aquí debe ser verificable; lo pendiente vive en docs/propuesta-arquitectura.md.
 */

export const SITE_URL = 'https://plagastop.cl'

export interface ContactArea {
  id: string
  name: string
  phone: string
  email?: string
  purpose: string
  /** Teléfono pendiente de confirmación: no se publica. */
  phoneUnconfirmed?: boolean
  /** El número atiende WhatsApp (confirmado por Plagastop). */
  whatsapp?: boolean
}

export const company = {
  name: 'Plagastop',
  legalName: 'Plagastop Ltda.',
  foundingYear: 1985,
  founder: 'Cecilia Otero',
  tagline: 'Prevención y control de plagas para empresas e industrias',
  mission:
    'Entregar a sus clientes un servicio de óptima calidad, personalizado y garantizado, mediante sistemas de última generación para la solución integral de problemas en control de plagas.',
  vision:
    'Ser la empresa de control de plagas más confiable y elegida por las industrias y organizaciones de la región y sur de Chile.',
  address: {
    street: 'Camino Los Carros 1826',
    area: 'Parque Industrial Ejército',
    city: 'Concepción',
    region: 'Región del Biobío',
    country: 'Chile',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Camino+Los+Carros+1826%2C+Concepci%C3%B3n%2C+Chile',
  },
  // Días por confirmar: Plagastop informó el rango horario, no los días.
  hours: { label: '9:00 a 18:00 h', opens: '09:00', closes: '18:00' },
  social: {
    facebook: 'https://www.facebook.com/plagastop/',
    instagram: 'https://www.instagram.com/plagastop.cl/',
    linkedin: 'https://cl.linkedin.com/company/plagastop-ltda',
  },
} as const

export const contactAreas: ContactArea[] = [
  {
    id: 'comercial',
    name: 'Área Comercial',
    phone: '+56977937824',
    whatsapp: true,
    email: 'areacomercial@plagastop.cl',
    purpose: 'Cotizaciones y nuevos servicios',
  },
  {
    id: 'secretaria',
    name: 'Secretaría',
    phone: '+56412104508',
    email: 'secretaria@plagastop.cl',
    purpose: 'Consultas generales, certificados e informes',
  },
]

export const salesArea = contactAreas[0]

/** Línea fija de la Secretaría: es el número al que llama el botón de teléfono del encabezado. */
export const officeArea = contactAreas[1]

/** Formulario de la página de Contacto: destino del botón "Solicitar cotización". */
export const QUOTE_HREF = '/contacto#formulario'

/** Horarios tal como se publican: la atención comercial tiene horario; la prestación del servicio es 24/7. */
export const COMMERCIAL_HOURS = `Atención comercial de ${company.hours.label}`
export const SERVICE_HOURS = 'Prestación del servicio 24/7'
