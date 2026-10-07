import { company, salesArea } from './company'
import { coverageSummary } from './coverage'
import { formatPhone } from '~/lib/contact'

/** Preguntas frecuentes generales. Solo respuestas con información confirmada. */
export const generalFaqs = [
  {
    q: '¿En qué zonas trabajan?',
    a: `${coverageSummary}. Atendemos todo el Gran Concepción (Concepción, Talcahuano, Hualpén, San Pedro de la Paz, Chiguayante, Hualqui, Penco, Lirquén, Tomé, Coronel y Lota), Los Ángeles, Chillán y toda la Región de Ñuble, además de las regiones de Los Ríos y Los Lagos.`,
  },
  {
    q: '¿Están autorizados por el SAG?',
    a: 'Sí. Plagastop cuenta con la Resolución SAG 2732/2021 para ejecutar tratamientos fitosanitarios oficiales de exportación e importación, y trabaja con el SAG en los puertos de la zona desde 1985.',
  },
  {
    q: '¿Cómo solicito una cotización?',
    a: `Completa el formulario de cotización con el tipo de instalación y lo que necesitas, o llama al Área Comercial al ${formatPhone(salesArea.phone)}. También puedes escribir a ${salesArea.email}.`,
  },
  {
    q: '¿Cuál es el horario de atención?',
    a: `Atendemos de ${company.hours.label}.`,
  },
  {
    q: '¿Desde cuándo operan?',
    a: 'Desde 1985. Plagastop nació en Concepción y en 2006 fue la primera empresa de control de plagas en Chile en certificarse bajo la norma ISO 9001.',
  },
  {
    q: '¿Atienden hogares?',
    a: 'Sí. Nuestro foco son empresas e industrias, pero también atendemos casas, departamentos y condominios.',
  },
]
