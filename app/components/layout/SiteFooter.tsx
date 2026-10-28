import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { COMMERCIAL_HOURS, company, officeArea, salesArea, SERVICE_HOURS } from '~/content/company'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
import { Logo } from '~/components/ui/Logo'
import styles from './SiteFooter.module.css'

// lucide no trae logos de marcas: se dibujan aquí, a 24px y con el color del texto.
const socials = [
  {
    label: 'Facebook',
    href: company.social.facebook,
    path: 'M14 8.5V6.6c0-.8.5-1.1 1-1.1h2V2h-2.8C11.1 2 10.5 4.3 10.5 5.9v2.6H8V12h2.5v10H14V12h2.7l.4-3.5H14Z',
  },
  {
    label: 'Instagram',
    href: company.social.instagram,
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z',
  },
  {
    label: 'LinkedIn',
    href: company.social.linkedin,
    path: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1ZM7.1 20.5H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z',
  },
]

/**
 * Pie breve: marca, los datos de contacto esenciales y redes. La navegación vive en el encabezado.
 */
export function SiteFooter({ variant = 'full' }: { variant?: 'full' | 'landing' }) {
  const year = new Date().getFullYear()

  return (
    <footer className={`${styles.footer} on-dark`}>
      {variant === 'full' && (
        <div className={`container ${styles.top}`}>
          <div className={styles.brand}>
            <Logo negative height={36} />
            <p>Prevención y control de plagas para empresas e industrias, desde Concepción.</p>
          </div>

          <ul className={styles.contact}>
            <li>
              <Phone size={18} strokeWidth={1.75} aria-hidden />
              <a href={telHref(officeArea.phone)} className="tabular">
                {formatPhone(officeArea.phone)}
              </a>
            </li>
            <li>
              <Mail size={18} strokeWidth={1.75} aria-hidden />
              <a href={mailHref(salesArea.email!)}>{salesArea.email}</a>
            </li>
            <li>
              <MapPin size={18} strokeWidth={1.75} aria-hidden />
              <a href={company.address.mapsUrl} target="_blank" rel="noopener noreferrer">
                {company.address.street}, {company.address.city}
              </a>
            </li>
            <li className={styles.hours}>
              {COMMERCIAL_HOURS} · {SERVICE_HOURS}
            </li>
          </ul>

          <div className={styles.social}>
            <p>Síguenos</p>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {company.name}
          {variant === 'landing' && ` · ${company.address.street}, ${company.address.city}`}
        </p>
        <Link to="/privacidad">Privacidad</Link>
      </div>
    </footer>
  )
}
