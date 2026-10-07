import { industries } from './industries'
import { primaryServices } from './services'

/** Opciones de los formularios de cotización. */

export const facilityOptions = [
  ...industries.map((i) => ({ value: i.slug, label: i.facility })),
  { value: 'hogar', label: 'Casa, departamento o condominio' },
  { value: 'otra', label: 'Otro tipo de instalación' },
]

/** "Qué necesitas" en el hero: lenguaje del cliente, mapeado a servicios. */
export const needOptions = [
  { value: 'programa-preventivo', label: 'Un programa preventivo', service: 'manejo-integrado-de-plagas' },
  { value: 'problema-activo', label: 'Resolver un problema activo', service: '' },
  { value: 'exportacion', label: 'Tratamiento para exportación (SAG)', service: 'tratamientos-fitosanitarios-sag' },
  { value: 'gas-free', label: 'Medición Gas Free', service: 'medicion-de-gases-gas-free' },
  { value: 'granos', label: 'Control de granos almacenados', service: 'fumigacion-de-granos-almacenados' },
  { value: 'no-se', label: 'No estoy seguro: necesito una evaluación', service: '' },
]

export const serviceOptions = [
  ...primaryServices.map((s) => ({ value: s.slug, label: s.shortName })),
  { value: 'control-de-plagas-residencial', label: 'Residencial' },
  { value: 'evaluacion', label: 'No lo sé, necesito una evaluación' },
]

export const urgencyOptions = [
  { value: 'preventivo', label: 'Preventivo o programado' },
  { value: 'problema-activo', label: 'Tengo un problema activo' },
  { value: 'fecha-embarque', label: 'Tengo una fecha de embarque o auditoría' },
]
