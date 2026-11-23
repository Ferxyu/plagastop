import { company, salesArea } from './company'
import { coverageDescription } from './coverage'
import { formatPhone } from '~/lib/contact'

/**
 * Preguntas frecuentes generales. Solo respuestas con información confirmada.
 * La primera se muestra abierta; la de zonas va más abajo porque el home ya la responde en Cobertura.
 */
export const generalFaqs = [
  {
    q: '¿Están autorizados por el SAG?',
    a: 'Sí. Plagastop cuenta con la Resolución SAG 3273/2025 para ejecutar tratamientos fitosanitarios oficiales de exportación e importación, y trabaja con el SAG en los puertos de la zona hace más de 25 años.',
  },
  {
    q: '¿Cómo solicito una cotización?',
    a: `Completa el formulario de cotización con el tipo de instalación y lo que necesitas, o llama al Área Comercial al ${formatPhone(salesArea.phone)}. También puedes escribir a ${salesArea.email}.`,
  },
  {
    q: '¿Cuál es el horario de atención?',
    a: `La atención comercial es de ${company.hours.label}. La prestación de los servicios es 24/7.`,
  },
  {
    q: '¿Desde cuándo operan?',
    a: 'Hace más de 25 años. Plagastop nació en Concepción y en 2006 fue la primera empresa de control de plagas en Chile en certificarse bajo la norma ISO 9001.',
  },
  {
    q: '¿En qué zonas trabajan?',
    a: coverageDescription,
  },
  {
    q: '¿Atienden hogares?',
    a: 'Sí. Nuestro foco son empresas e industrias, pero también atendemos el sector domiciliario.',
  },
]
