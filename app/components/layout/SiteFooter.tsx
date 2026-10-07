import { Link } from 'react-router'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { company, contactAreas, salesArea } from '~/content/company'
import { coverageSummary } from '~/content/coverage'
import { industries } from '~/content/industries'
import { primaryServices } from '~/content/services'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
import { Logo } from '~/components/ui/Logo'
import styles from './SiteFooter.module.css'

export function SiteFooter({ variant = 'full' }: { variant?: 'full' | 'landing' }) {
  const year = new Date().getFullYear()

  if (variant === 'landing') {
    return (
      <footer className={`${styles.footer} on-dark`}>
        <div className={`container ${styles.bottom}`}>
          <p>
            © {year} {company.name} · {company.address.street}, {company.address.city}
          </p>
          <Link to="/privacidad">Privacidad</Link>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className="container">
        <ul className={styles.strip}>
          <li>
            <span className={styles.stripIcon}>
              <Mail size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className={styles.stripLabel}>Correo comercial</span>
              <a href={mailHref(salesArea.email!)}>{salesArea.email}</a>
            </span>
          </li>
          <li>
            <span className={styles.stripIcon}>
              <Phone size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className={styles.stripLabel}>Área Comercial</span>
              <a href={telHref(salesArea.phone)} className="tabular">
                {formatPhone(salesArea.phone)}
              </a>
            </span>
          </li>
          <li>
            <span className={styles.stripIcon}>
              <MapPin size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className={styles.stripLabel}>Dirección</span>
              <a href={company.address.mapsUrl} target="_blank" rel="noopener noreferrer">
                {company.address.street}, {company.address.city}
              </a>
            </span>
          </li>
          <li>
            <span className={styles.stripIcon}>
              <Clock size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className={styles.stripLabel}>Horario de atención</span>
              <span className={styles.stripValue}>{company.hours.label}</span>
            </span>
          </li>
        </ul>
      </div>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo negative height={36} />
          <p>
            Prevención y control de plagas para empresas e industrias desde {company.foundingYear}.{' '}
            {coverageSummary}.
          </p>
          <address>
            {company.address.street}
            <br />
            {company.address.area}, {company.address.city}
            <br />
            Atención: {company.hours.label}
            <br />
            <a href={company.address.mapsUrl} target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
            </a>
          </address>
        </div>

        <nav className={styles.col} aria-label="Servicios">
          <p className={styles.colTitle}>Servicios</p>
          <ul>
            {primaryServices.map((s) => (
              <li key={s.slug}>
                <Link to={`/servicios/${s.slug}`}>{s.shortName}</Link>
              </li>
            ))}
            <li>
              <Link to="/servicios/control-de-plagas-residencial">Residencial</Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Industrias">
          <p className={styles.colTitle}>Industrias</p>
          <ul>
            {industries.map((i) => (
              <li key={i.slug}>
                <Link to={`/industrias/${i.slug}`}>{i.name}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.colTitle}>Empresa</p>
          <ul>
            <li>
              <Link to="/empresa">Quiénes somos</Link>
            </li>
            <li>
              <Link to="/acreditaciones">Acreditaciones</Link>
            </li>
            <li>
              <Link to="/cotizar">Solicitar cotización</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contacto</p>
          <ul className={styles.contacts}>
            {contactAreas.map((a) => (
              <li key={a.id}>
                <span>{a.name}</span>
                {!a.phoneUnconfirmed && (
                  <a href={telHref(a.phone)} className="tabular">
                    {formatPhone(a.phone)}
                  </a>
                )}
                {a.email && <a href={mailHref(a.email)}>{a.email}</a>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {company.name}. Todos los derechos reservados.
        </p>
        <ul>
          <li>
            <a href={company.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href={company.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <Link to="/privacidad">Privacidad</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
