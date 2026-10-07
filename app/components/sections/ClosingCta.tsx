import type { ReactNode } from 'react'
import { Check, Phone } from 'lucide-react'
import { company, salesArea } from '~/content/company'
import type { PhotoId } from '~/content/photos'
import { formatPhone, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import styles from './ClosingCta.module.css'

/** Banda lima de cierre: foto real del equipo en terreno y la acción principal. */
export function ClosingCta({
  title = (
    <>
      ¿Tu operación necesita <mark>control de plagas</mark>?
    </>
  ),
  text = 'Cuéntanos qué tipo de instalación tienes. Te visitamos, evaluamos en terreno y te proponemos un plan a la medida.',
  quoteHref = '/cotizar',
  location = 'closing',
  image = 'traslado-equipos-a-bordo',
}: {
  title?: ReactNode
  text?: string
  quoteHref?: string
  location?: string
  image?: PhotoId
}) {
  return (
    <section className={`section ${styles.band}`} aria-labelledby={`${location}-title`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.media} data-reveal>
          <Photo id={image} sizes="(min-width: 1000px) 40vw, 100vw" />
        </div>
        <div className={styles.copy} data-reveal={1}>
          <h2 id={`${location}-title`}>{title}</h2>
          <p className={styles.text}>{text}</p>
          <ul className={styles.points}>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> Evaluación en terreno
            </li>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> Atención de {company.hours.label}
            </li>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> Desde Ñuble hasta Los Lagos
            </li>
          </ul>
          <div className={styles.actions}>
            <ButtonLink
              to={quoteHref}
              size="lg"
              variant="secondary"
              arrow
              onClick={() => track('cta_click', { location })}
            >
              Solicitar cotización
            </ButtonLink>
            <ButtonLink
              to={telHref(salesArea.phone)}
              variant="outline"
              size="lg"
              icon={<Phone size={18} strokeWidth={2} aria-hidden />}
              onClick={() => track('tel_click', { location })}
            >
              Hablar con un especialista
            </ButtonLink>
          </div>
          <p className={styles.phone}>
            Área Comercial <span className="tabular">{formatPhone(salesArea.phone)}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
