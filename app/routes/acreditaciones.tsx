import { ShieldCheck } from 'lucide-react'
import type { Route } from './+types/acreditaciones'
import { credentials, milestones } from '~/content/credentials'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { ButtonLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import { ClosingCta } from '~/components/sections/ClosingCta'
import styles from './page.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Acreditaciones', path: '/acreditaciones' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Acreditaciones y autorizaciones',
    description:
      'Resolución SAG 2732/2021 para tratamientos fitosanitarios oficiales, resolución SNS 36365/2013 y Programa de Empresas Certificadas Degesch.',
    path: '/acreditaciones',
    jsonLd: [breadcrumbLd(crumbs)],
  })

const certifications = milestones.filter((m) => m.year === 2006 || m.year === 2009)

export default function Credentials() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="fumigacion-placas-degesch"
        title="Acreditaciones y autorizaciones"
        lead="La información que piden las áreas de calidad, prevención y compras antes de contratar un proveedor de control de plagas."
        actions={
          <ButtonLink to="/contacto" size="lg" arrow>
            Solicitar documentación
          </ButtonLink>
        }
      />

      <section className="section">
        <div className="container">
          <ul className={styles.credentials}>
            {credentials.map((c, i) => (
              <li key={c.id} className={styles.credential} data-reveal={i}>
                <ShieldCheck strokeWidth={1.75} aria-hidden />
                <p className={styles.credentialIssuer}>{c.issuer}</p>
                <p className={styles.credentialCode}>{c.code}</p>
                <h2 style={{ fontSize: 'var(--text-h3)' }}>{c.title}</h2>
                <p>{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--sage">
        <div className={`container ${styles.split}`}>
          <h2>Certificaciones de gestión</h2>
          <ol className={styles.timeline} data-draw>
            {certifications.map((m) => (
              <li key={m.year}>
                <div>
                  <p className={styles.year}>{m.year}</p>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            ¿Necesitas <mark>documentación</mark> de tu proveedor?
          </>
        }
        text="El área de Documentación te entrega certificados, informes y antecedentes de nuestros servicios."
        location="credentials_closing"
        image="detector-gas-residual"
      />
    </>
  )
}
