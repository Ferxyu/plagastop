/**
 * Acreditaciones y trayectoria. Fuente: plagastop.cl.
 * Las certificaciones ISO/OHSAS se publican como hitos históricos, no como vigentes,
 * hasta que Plagastop confirme su vigencia.
 */

export interface Credential {
  id: string
  code: string
  issuer: string
  title: string
  description: string
}

export const credentials: Credential[] = [
  {
    id: 'sag',
    code: 'Res. SAG 2732/2021',
    issuer: 'Servicio Agrícola y Ganadero',
    title: 'Tratamientos fitosanitarios oficiales',
    description:
      'Autorización para ejecutar tratamientos fitosanitarios de exportación e importación.',
  },
  {
    id: 'sns',
    code: 'SNS 36365/2013',
    issuer: 'Autoridad Sanitaria',
    title: 'Resolución sanitaria',
    // Alcance exacto de la resolución por confirmar con Plagastop.
    description: 'Resolución otorgada por la autoridad sanitaria.',
  },
  {
    id: 'pec',
    code: 'PEC Degesch',
    issuer: 'Laboratorios Degesch',
    title: 'Programa de Empresas Certificadas',
    description: 'Empresa certificada en el programa de Laboratorios Degesch desde 2003.',
  },
]

export interface Milestone {
  year: number
  title: string
  text: string
}

export const milestones: Milestone[] = [
  {
    year: 1985,
    title: 'Fundación en Concepción',
    text: 'Cecilia Otero funda Plagastop. Ese mismo año firma convenio con el SAG para tratar productos de exportación e importación en los puertos de la VIII Región.',
  },
  {
    year: 1999,
    title: 'Registro de pesticidas domésticos',
    text: 'Plagastop obtiene el registro para la aplicación de pesticidas de uso doméstico.',
  },
  {
    year: 2003,
    title: 'Alianza con Degesch',
    text: 'Ingreso al Programa de Empresas Certificadas (PEC) de Laboratorios Degesch.',
  },
  {
    year: 2006,
    title: 'Primera certificación ISO del rubro',
    text: 'Certificación ISO 9001:2000 con AENOR: la primera empresa de control de plagas en Chile en obtenerla.',
  },
  {
    year: 2009,
    title: 'Sistema de gestión integrado',
    text: 'Certificación ISO 9001 y OHSAS 18001 con Bureau Veritas.',
  },
  {
    year: 2013,
    title: 'Resolución sanitaria SNS 36365',
    text: 'Resolución otorgada por la autoridad sanitaria.',
  },
  {
    year: 2021,
    title: 'Resolución SAG 2732',
    text: 'Autorización SAG para tratamientos fitosanitarios oficiales de exportación e importación.',
  },
]
