import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { mainNav } from '~/content/navigation'
import { contactAreas, company, salesArea } from '~/content/company'
import { primaryServices } from '~/content/services'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import { Logo } from '~/components/ui/Logo'
import { ServiceIcon } from '~/components/ui/ServiceIcon'
import styles from './SiteHeader.module.css'

export function SiteHeader({ variant = 'full' }: { variant?: 'full' | 'landing' }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  // Cerrar menús al navegar
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpenMenu(null)
    setDrawer(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setDrawer(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [drawer])

  if (variant === 'landing') {
    return (
      <header className={styles.header}>
        <div className={`container ${styles.bar}`}>
          <Link to="/" className={styles.logo} aria-label="Plagastop, ir al inicio">
            <Logo />
          </Link>
          <a
            className={styles.phone}
            href={telHref(salesArea.phone)}
            onClick={() => track('tel_click', { location: 'landing_header' })}
          >
            <Phone size={18} strokeWidth={1.75} aria-hidden />
            <span className="tabular">{formatPhone(salesArea.phone)}</span>
          </a>
        </div>
      </header>
    )
  }

  return (
    <header
      ref={headerRef}
      className={styles.header}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.logo} aria-label="Plagastop, ir al inicio">
          <Logo />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul>
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href} onMouseEnter={() => setOpenMenu(item.label)}>
                  <button
                    type="button"
                    className={styles.navItem}
                    aria-expanded={openMenu === item.label}
                    aria-controls={`menu-${item.label}`}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    data-current={location.pathname.startsWith(item.href) || undefined}
                  >
                    {item.label}
                    <ChevronDown size={16} strokeWidth={1.75} aria-hidden />
                  </button>
                </li>
              ) : (
                <li key={item.href} onMouseEnter={() => setOpenMenu(null)}>
                  <NavLink to={item.href} className={styles.navItem} prefetch="intent">
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            className={styles.phone}
            href={telHref(salesArea.phone)}
            onClick={() => track('tel_click', { location: 'header' })}
          >
            <Phone size={18} strokeWidth={1.75} aria-hidden />
            <span className="tabular">{formatPhone(salesArea.phone)}</span>
          </a>
          <ButtonLink
            to="/cotizar"
            className={styles.cta}
            onClick={() => track('cta_click', { location: 'header' })}
          >
            Solicitar cotización
          </ButtonLink>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={drawer}
            aria-controls="menu-movil"
            onClick={() => setDrawer(!drawer)}
          >
            {drawer ? <X size={24} strokeWidth={1.75} aria-hidden /> : <Menu size={24} strokeWidth={1.75} aria-hidden />}
            <span className="visually-hidden">{drawer ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      {/* Mega menú: Servicios */}
      <div
        id="menu-Servicios"
        className={styles.mega}
        hidden={openMenu !== 'Servicios'}
      >
        <div className={`container ${styles.megaInner}`}>
          <ul className={styles.megaServices}>
            {primaryServices.map((s) => (
              <li key={s.slug}>
                <Link to={`/servicios/${s.slug}`} className={styles.megaLink} prefetch="intent">
                  <span className={styles.megaIcon} data-featured={s.featured || undefined}>
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span>
                    <strong>{s.shortName}</strong>
                    <span className={styles.megaDesc}>{s.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <aside className={styles.megaAside}>
            <p className={styles.megaAsideTitle}>¿No sabes qué servicio necesitas?</p>
            <p>Inspeccionamos tu instalación y te proponemos un plan de control.</p>
            <TextLink to="/cotizar?servicio=evaluacion">Solicitar una evaluación</TextLink>
            <TextLink to="/servicios">Ver todos los servicios</TextLink>
          </aside>
        </div>
      </div>

      {/* Mega menú: Industrias */}
      <div
        id="menu-Industrias"
        className={styles.mega}
        hidden={openMenu !== 'Industrias'}
      >
        <div className={`container ${styles.megaInner}`}>
          <ul className={styles.megaIndustries}>
            {mainNav[1].children!.map((i) => (
              <li key={i.href}>
                <Link to={i.href} className={styles.megaIndustry} prefetch="intent">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <aside className={styles.megaAside}>
            <p className={styles.megaAsideTitle}>Cada instalación tiene sus propios riesgos</p>
            <p>Revisa cómo trabajamos en tu tipo de instalación.</p>
            <TextLink to="/industrias">Ver todas las industrias</TextLink>
          </aside>
        </div>
      </div>

      {/* Menú móvil */}
      <div id="menu-movil" className={styles.drawer} hidden={!drawer}>
        <nav aria-label="Menú móvil" className={styles.drawerNav}>
          {mainNav.map((item) =>
            item.children ? (
              <details key={item.href} className={styles.drawerGroup}>
                <summary>
                  {item.label}
                  <ChevronDown size={20} strokeWidth={1.75} aria-hidden />
                </summary>
                <ul>
                  <li>
                    <Link to={item.href}>Ver todo</Link>
                  </li>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link to={child.href}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link key={item.href} to={item.href} className={styles.drawerLink}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className={styles.drawerContact}>
          <ButtonLink to="/cotizar" block arrow>
            Solicitar cotización
          </ButtonLink>
          <ul>
            {contactAreas.slice(0, 3).map((a) => (
              <li key={a.id}>
                <span>{a.name}</span>
                <a href={telHref(a.phone)} className="tabular">
                  {formatPhone(a.phone)}
                </a>
              </li>
            ))}
            <li>
              <span>Correo comercial</span>
              <a href={mailHref(salesArea.email!)}>{salesArea.email}</a>
            </li>
          </ul>
          <p className={styles.drawerHours}>Horario de atención: {company.hours.label}</p>
        </div>
      </div>
    </header>
  )
}
