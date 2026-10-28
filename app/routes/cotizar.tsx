import { Check } from 'lucide-react'
import type { Route } from './+types/cotizar'
import { COMMERCIAL_HOURS, SERVICE_HOURS, salesArea } from '~/content/company'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import { QuoteForm } from '~/components/forms/QuoteForm'
import type { RouteHandle } from '~/root'
import styles from './page.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Solicitar cotización', path: '/cotizar' },
]

export const handle: RouteHandle = { hideActionBar: true }

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Solicitar cotización',
    description:
      'Cotiza control de plagas para tu empresa en dos pasos. Plantas, bodegas, restaurantes, puertos y agroindustria. Desde Concepción, llegamos de Ñuble a Los Lagos.',
    path: '/cotizar',
    jsonLd: [breadcrumbLd(crumbs)],
  })

export default function Quote() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="fdw-camiones"
        title="Solicitar cotización"
        lead="Dos pasos: cuéntanos qué necesitas y cómo contactarte. El Área Comercial te responde con una propuesta para tu instalación."
      />
      <section className="section section--paper">
        <div className={`container ${styles.quoteLayout}`}>
          <div className={styles.formPanel}>
            <QuoteForm />
          </div>
          <aside className={`${styles.quoteAside} on-dark`} aria-label="Contacto directo">
            <h2>¿Prefieres hablar con alguien?</h2>
            <p>
              Área Comercial:{' '}
              <a href={telHref(salesArea.phone)} className="tabular">
                {formatPhone(salesArea.phone)}
              </a>
              <br />
              <a href={mailHref(salesArea.email!, 'Solicitud de cotización')}>{salesArea.email}</a>
            </p>
            <ul className={styles.facts}>
              <li>
                <Check strokeWidth={2.5} aria-hidden /> {COMMERCIAL_HOURS}
              </li>
              <li>
                <Check strokeWidth={2.5} aria-hidden /> {SERVICE_HOURS}
              </li>
              <li>
                <Check strokeWidth={2.5} aria-hidden /> Más de 25 años en Concepción
              </li>
              <li>
                <Check strokeWidth={2.5} aria-hidden /> Autorizados por el SAG (Res. 3273/2025)
              </li>
              <li>
                <Check strokeWidth={2.5} aria-hidden /> Desde Concepción, llegamos de Ñuble a Los Lagos
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
