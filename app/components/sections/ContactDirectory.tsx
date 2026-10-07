import { Mail, Phone } from 'lucide-react'
import { contactAreas } from '~/content/company'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import styles from './ContactDirectory.module.css'

/** Todas las vías de contacto por área, siempre visibles y marcables. */
export function ContactDirectory({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <ul className={`${styles.list} ${styles[tone]}`}>
      {contactAreas.map((area) => (
        <li key={area.id} className={styles.area}>
          <div>
            <p className={styles.name}>{area.name}</p>
            <p className={styles.purpose}>{area.purpose}</p>
          </div>
          <div className={styles.channels}>
            {!area.phoneUnconfirmed && (
              <a
                href={telHref(area.phone)}
                className="tabular"
                onClick={() => track('tel_click', { location: 'directory', area: area.id })}
              >
                <Phone size={16} strokeWidth={1.75} aria-hidden />
                {formatPhone(area.phone)}
              </a>
            )}
            {area.email && (
              <a
                href={mailHref(area.email)}
                onClick={() => track('email_click', { location: 'directory', area: area.id })}
              >
                <Mail size={16} strokeWidth={1.75} aria-hidden />
                {area.email}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
