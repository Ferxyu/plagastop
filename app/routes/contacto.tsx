import type { Route } from './+types/contacto'
import { company } from '~/content/company'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import { ContactDirectory } from '~/components/sections/ContactDirectory'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { ContactForm } from '~/components/forms/ContactForm'
import styles from './page.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Contacto', path: '/contacto' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Contacto',
    description:
      'Teléfonos y correos por área, dirección y horario de Plagastop. Camino Los Carros 1826, Parque Industrial Ejército, Concepción.',
    path: '/contacto',
    jsonLd: [breadcrumbLd(crumbs)],
  })

export default function Contact() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="sede-fachada"
        title="Contacto"
        lead="Llama o escribe directamente al área que necesitas. Para cotizar un servicio, usa el formulario de cotización: es más rápido."
        actions={
          <ButtonLink to="/cotizar" size="lg" arrow>
            Solicitar cotización
          </ButtonLink>
        }
      />

      <section className="section">
        <div className={`container ${styles.contactGrid}`}>
          <div style={{ display: 'grid', gap: 'var(--s-7)', alignContent: 'start' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--s-5)' }}>Teléfonos y correos <mark>por área</mark></h2>
              <ContactDirectory />
            </div>
            <div style={{ display: 'grid', gap: 'var(--s-4)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)' }}>Dirección y horario</h2>
              <address className={styles.address}>
                <span>
                  {company.address.street}, {company.address.area}
                </span>
                <span>
                  {company.address.city}, {company.address.region}
                </span>
                <span>Horario de atención: {company.hours.label}</span>
              </address>
              <TextLink to={company.address.mapsUrl}>Cómo llegar (Google Maps)</TextLink>
            </div>
          </div>
          <div className={styles.formPanel}>
            <h2>Escríbenos</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section section--sage">
        <div className={`container ${styles.split}`}>
          <h2>Zonas de cobertura</h2>
          <CoverageLine />
        </div>
      </section>
    </>
  )
}
