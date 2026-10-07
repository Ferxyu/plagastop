import type { Route } from './+types/cotizar.gracias'
import { company, salesArea } from '~/content/company'
import { formatPhone, telHref } from '~/lib/contact'
import { buildMeta } from '~/lib/seo'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import type { RouteHandle } from '~/root'
import styles from './page.module.css'

export const handle: RouteHandle = { hideActionBar: true }

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Solicitud recibida',
    description: 'Recibimos tu solicitud de cotización.',
    path: '/cotizar/gracias',
    noindex: true,
  })

export default function Thanks() {
  return (
    <section className="section">
      <div className={`container ${styles.empty}`}>
        <h1>Recibimos tu solicitud</h1>
        <p className="lead">
          El Área Comercial revisará tu información y te contactará dentro del horario de atención (
          {company.hours.label}).
        </p>
        <p>
          Si tu caso es urgente, llama directamente al{' '}
          <a href={telHref(salesArea.phone)} className="tabular" style={{ fontWeight: 600 }}>
            {formatPhone(salesArea.phone)}
          </a>
          .
        </p>
        <ButtonLink to="/servicios" variant="secondary" arrow>
          Conocer nuestros servicios
        </ButtonLink>
        <TextLink to="/">Volver al inicio</TextLink>
      </div>
    </section>
  )
}
