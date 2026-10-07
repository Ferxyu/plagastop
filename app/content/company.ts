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
}

export const company = {
  name: 'Plagastop',
  legalName: 'Plagastop Ltda.',
  foundingYear: 1985,
  founder: 'Cecilia Otero',
  tagline: 'Prevención y control de plagas para empresas e industrias',
  mission:
    'Entregamos a nuestros clientes un servicio de óptima calidad, personalizado y garantizado.',
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
    instagram: 'https://www.instagram.com/plagastop_ltda',
  },
} as const

export const contactAreas: ContactArea[] = [
  {
    id: 'comercial',
    name: 'Área Comercial',
    phone: '+56977937483',
    email: 'jpross@plagastop.cl',
    purpose: 'Cotizaciones y nuevos servicios',
  },
  {
    id: 'operaciones',
    name: 'Área Operaciones',
    phone: '+56977937786',
    email: 'cglarson@plagastop.cl',
    purpose: 'Visitas programadas y servicios en curso',
  },
  {
    id: 'prevencion',
    name: 'Área Prevención',
    phone: '+56977937939',
    email: 'jpena@plagastop.cl',
    purpose: 'Prevención de riesgos',
  },
  {
    id: 'documentacion',
    name: 'Documentación',
    // Publicado como "+56 9 41 2104508" (un dígito de más para un móvil).
    // Se asume fijo de Concepción (código 41). [Confirmar con Plagastop]
    phone: '+56412104508',
    phoneUnconfirmed: true,
    email: 'secretaria@plagastop.cl',
    purpose: 'Certificados e informes de servicio',
  },
  {
    id: 'secretaria',
    name: 'Secretaría',
    phone: '+56978555078',
    purpose: 'Recepción y consultas generales',
  },
]

export const salesArea = contactAreas[0]
