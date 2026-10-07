import type { Route } from './+types/not-found'
import { buildMeta } from '~/lib/seo'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import styles from './page.module.css'

export const meta: Route.MetaFunction = ({ location }) =>
  buildMeta({
    title: 'Página no encontrada',
    description: 'La página que buscas no existe.',
    path: location.pathname,
    noindex: true,
  })

export default function NotFound() {
  return (
    <section className="section">
      <div className={`container ${styles.empty}`}>
        <h1>Esta página no existe</h1>
        <p className="lead">Puede que el enlace haya cambiado. Revisa nuestros servicios o vuelve al inicio.</p>
        <ButtonLink to="/servicios" arrow>
          Ver servicios
        </ButtonLink>
        <TextLink to="/">Volver al inicio</TextLink>
      </div>
    </section>
  )
}
