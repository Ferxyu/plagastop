import type { Route } from './+types/contacto'
import { COMMERCIAL_HOURS, company, SERVICE_HOURS } from '~/content/company'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { TextLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import { ContactDirectory } from '~/components/sections/ContactDirectory'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { ContactForm } from '~/components/forms/ContactForm'
import { coverageSummary } from '~/content/coverage'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './page.module.css'
import e from './empresa.module.css'

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
        image="sede-concepcion"
        title="Contacto"
        lead="Llama o escribe directamente al área que necesitas. Para cotizar un servicio, completa el formulario y te respondemos a la brevedad."
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
                <span>{COMMERCIAL_HOURS}</span>
                <span>{SERVICE_HOURS}</span>
              </address>
              <TextLink to={company.address.mapsUrl}>Cómo llegar (Google Maps)</TextLink>
            </div>
          </div>
          <div id="formulario" className={styles.formPanel}>
            <h2>Escríbenos</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className={`section on-dark ${e.coverage}`} aria-labelledby="cobertura-title">
        <MoleculeField />
        <div className={`container ${styles.split} ${e.inner}`}>
          <div className={styles.stack}>
            <h2 id="cobertura-title" data-reveal>
              Zonas de <span className={e.lime}>cobertura</span>
            </h2>
            <p data-reveal={1}>{coverageSummary}.</p>
          </div>
          <CoverageLine />
        </div>
      </section>
    </>
  )
}
