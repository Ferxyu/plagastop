import type { Route } from './+types/empresa'
import { company } from '~/content/company'
import { milestones } from '~/content/credentials'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { TextLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { PageHero } from '~/components/sections/PageHero'
import { Steps } from '~/components/sections/Steps'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { ClosingCta } from '~/components/sections/ClosingCta'
import styles from './page.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Empresa', path: '/empresa' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Empresa: control de plagas en Concepción desde 1985',
    description:
      'Plagastop nació en Concepción en 1985. Primera empresa de control de plagas en Chile con certificación ISO 9001 (2006). Autorizada por el SAG.',
    path: '/empresa',
    jsonLd: [breadcrumbLd(crumbs)],
  })

const values = [
  {
    title: 'Innovación constante',
    text: 'Incorporamos nuevos sistemas y métodos para entregar soluciones integrales de control.',
  },
  {
    title: 'Control de procesos',
    text: 'Cada servicio sigue un proceso definido, con garantía operativa.',
  },
  {
    title: 'Cumplimiento',
    text: 'Trabajamos según las exigencias de la autoridad sanitaria y de cada cliente.',
  },
]

export default function Company() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="sede-concepcion"
        title="Cuatro décadas controlando plagas en el sur de Chile"
        lead={`Plagastop nació en Concepción en ${company.foundingYear}, fundada por ${company.founder}. Desde nuestra sede en el ${company.address.area} protegemos industrias, bodegas, empresas de alimentos y puertos.`}
      />

      <section className="section">
        <div className={`container ${styles.twoCol}`}>
          <div className={styles.media} data-reveal>
            <Photo id="equipo-en-nave" sizes="(min-width: 1000px) 45vw, 100vw" />
          </div>
          <div className={styles.stack} data-reveal={1}>
            <h2>
              Nuestra <mark>misión</mark>
            </h2>
            <p className="lead" style={{ color: 'var(--ps-ink)' }}>
              “{company.mission}”
            </p>
            <p>
              Trabajamos con sistemas de vanguardia para controlar insectos, roedores y microorganismos, preservando la
              seguridad y el valor de los productos de nuestros clientes, y resolviendo problemas de plagas que afectan
              la salud pública y la operación de la industria.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className={`container ${styles.split}`}>
          <h2 data-reveal>
            Nuestra <mark>trayectoria</mark>
          </h2>
          <ol className={styles.timeline}>
            {milestones.map((m, i) => (
              <li key={m.year} data-reveal={i % 3}>
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

      <section className="section">
        <div className="container">
          <SectionHeader title="Lo que guía nuestro trabajo" />
          <ul className={styles.reasons}>
            {values.map((v, i) => (
              <li key={v.title} data-reveal={i}>
                <span className="tabular" aria-hidden>
                  {i + 1}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <SectionHeader title="Cómo trabajamos" />
          <Steps />
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2>
              <mark>Cobertura</mark>
            </h2>
            <TextLink to="/acreditaciones">Ver acreditaciones</TextLink>
          </div>
          <CoverageLine />
        </div>
      </section>

      <ClosingCta image="monitoreo-fosfina-barco" />
    </>
  )
}
