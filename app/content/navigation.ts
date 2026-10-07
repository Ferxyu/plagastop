import { industries } from './industries'
import { primaryServices } from './services'

export interface NavLink {
  label: string
  href: string
  description?: string
}

export interface NavGroup {
  label: string
  href: string
  children?: NavLink[]
}

export const mainNav: NavGroup[] = [
  {
    label: 'Servicios',
    href: '/servicios',
    children: primaryServices.map((s) => ({
      label: s.shortName,
      href: `/servicios/${s.slug}`,
      description: s.summary,
    })),
  },
  {
    label: 'Industrias',
    href: '/industrias',
    children: industries.map((i) => ({ label: i.name, href: `/industrias/${i.slug}` })),
  },
  { label: 'Empresa', href: '/empresa' },
  { label: 'Acreditaciones', href: '/acreditaciones' },
  { label: 'Contacto', href: '/contacto' },
]
