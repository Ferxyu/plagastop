import styles from './blog.module.css'

/** Cierre comercial del blog y de cada artículo (el contacto queda en el encabezado y en WhatsApp). */
export function BlogCta({ location }: { location: string }) {
  return (
    <section className={`section on-dark ${styles.cta}`} aria-labelledby={`${location}-cta-title`}>
      <div className={`container ${styles.ctaInner}`}>
        <h2 id={`${location}-cta-title`}>¿Necesitas proteger las operaciones de tu empresa?</h2>
        <p>
          Nuestro equipo puede ayudarte a identificar riesgos y desarrollar estrategias de control de plagas adaptadas a
          tus instalaciones.
        </p>
      </div>
    </section>
  )
}
