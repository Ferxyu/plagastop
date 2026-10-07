/** Cobertura confirmada por Plagastop (octubre 2026), de norte a sur. */

export interface CoverageZone {
  region: string
  scope: string
  places: string[]
  base?: boolean
}

export const coverage: CoverageZone[] = [
  {
    region: 'Región de Ñuble',
    scope: 'Toda la región',
    places: ['Chillán'],
  },
  {
    region: 'Región del Biobío',
    scope: 'Gran Concepción y Los Ángeles',
    places: [
      'Concepción',
      'Talcahuano',
      'Hualpén',
      'San Pedro de la Paz',
      'Chiguayante',
      'Hualqui',
      'Penco',
      'Lirquén',
      'Tomé',
      'Coronel',
      'Lota',
      'Los Ángeles',
    ],
    base: true,
  },
  {
    region: 'Región de Los Ríos',
    scope: 'Toda la región',
    places: [],
  },
  {
    region: 'Región de Los Lagos',
    scope: 'Toda la región',
    places: [],
  },
]

export const coverageSummary = 'Desde Ñuble hasta Los Lagos'

/** Valores para schema.org areaServed */
export const areaServed = [
  'Región de Ñuble',
  'Concepción',
  'Talcahuano',
  'Hualpén',
  'San Pedro de la Paz',
  'Chiguayante',
  'Hualqui',
  'Penco',
  'Tomé',
  'Coronel',
  'Lota',
  'Los Ángeles',
  'Región de Los Ríos',
  'Región de Los Lagos',
]
