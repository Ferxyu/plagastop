import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import styles from './blog.module.css'

/** Cierre comercial del blog y de cada artículo: lleva a la página de contacto existente. */
export function BlogCta({ location }: { location: string }) {
  return (
    <section className={`section on-dark ${styles.cta}`} aria-labelledby={`${location}-cta-title`}>
      <div className={`container ${styles.ctaInner}`}>
        <h2 id={`${location}-cta-title`}>¿Necesitas proteger las operaciones de tu empresa?</h2>
        <p>
          Nuestro equipo puede ayudarte a identificar riesgos y desarrollar estrategias de control de plagas adaptadas a
          tus instalaciones.
        </p>
        <ButtonLink to="/contacto" size="lg" arrow onClick={() => track('cta_click', { location })}>
          Contactar a un especialista
        </ButtonLink>
      </div>
    </section>
  )
}
