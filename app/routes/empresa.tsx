import type { Route } from './+types/empresa'
import { company } from '~/content/company'
import { milestones } from '~/content/credentials'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { Photo } from '~/components/ui/Photo'
import { PageHero } from '~/components/sections/PageHero'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { ClosingCta } from '~/components/sections/ClosingCta'
import { SedeVideo } from '~/components/sections/SedeVideo'
import { IsotypeAssembly } from '~/components/brand/IsotypeAssembly'
import { MoleculeField } from '~/components/brand/MoleculeField'
import { coverageSummary } from '~/content/coverage'
import styles from './page.module.css'
import e from './empresa.module.css'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Empresa', path: '/empresa' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Empresa: control de plagas en Concepción, más de 25 años',
    description:
      'Plagastop nació en Concepción en 1985. Primera empresa de control de plagas en Chile con certificación ISO 9001 (2006). Autorizada por el SAG.',
    path: '/empresa',
    jsonLd: [breadcrumbLd(crumbs)],
  })

/** Versión breve de los valores y del proceso, a los lados del video de la sede. */
const values = [
  { title: 'Innovación constante', text: 'Nuevos sistemas y métodos para soluciones integrales.' },
  { title: 'Control de procesos', text: 'Cada servicio sigue un proceso definido.' },
  { title: 'Cumplimiento', text: 'Según la autoridad sanitaria y cada cliente.' },
]

const steps = [
  { title: 'Cuéntanos qué necesitas', text: 'Tipo de instalación, ubicación y qué observaste.' },
  { title: 'Evaluamos en terreno', text: 'Accesos, zonas críticas y un plan a tu medida.' },
  { title: 'Tratamos y hacemos seguimiento', text: 'Con registro de cada servicio para tu gestión de calidad.' },
]

export default function Company() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="fdw-equipo"
        title="Cuatro décadas controlando plagas en el sur de Chile"
        molecules
        lead={`Plagastop nació en Concepción en ${company.foundingYear}, fundada por ${company.founder}. Desde nuestra sede en el ${company.address.area} protegemos industrias, bodegas, empresas de alimentos y puertos.`}
      />

      <section className={`section ${e.light}`}>
        <MoleculeField tone="light" />
        <div className={`container ${styles.twoCol} ${e.inner}`}>
          <div className={styles.media} data-reveal data-reveal-style="clip">
            <Photo id="equipo-plagastop" sizes="(min-width: 1000px) 45vw, 100vw" parallax={0.08} />
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

      {/* Sede: video al centro; a los lados, lo que guía el trabajo y cómo trabajamos */}
      <section className={`section on-dark ${e.sede}`} aria-labelledby="sede-title">
        <MoleculeField />
        <div className={`container ${e.inner}`}>
          <header className={e.sedeHead}>
            <IsotypeAssembly className={e.iso} />
            <h2 id="sede-title" data-reveal>
              Nuestra <span className={e.lime}>sede</span>
            </h2>
            <p data-reveal={1}>Nuestra sede en Concepción es una expresión de la identidad y trayectoria de Plagastop.</p>
          </header>
          <div className={e.sedeGrid}>
            <div className={e.side}>
              <h3 data-reveal>Lo que guía nuestro trabajo</h3>
              <ol className={e.list}>
                {values.map((v, i) => (
                  <li key={v.title} data-reveal={i + 1}>
                    <span className={e.n} aria-hidden>
                      {i + 1}
                    </span>
                    <span>
                      <b>{v.title}</b>
                      {v.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <SedeVideo />
            <div className={e.side}>
              <h3 data-reveal>Cómo trabajamos</h3>
              <ol className={e.list}>
                {steps.map((st, i) => (
                  <li key={st.title} data-reveal={i + 1}>
                    <span className={e.n} aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <b>{st.title}</b>
                      {st.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className={`container ${styles.split}`}>
          <h2 data-reveal>
            Nuestra <mark>trayectoria</mark>
          </h2>
          <ol className={styles.timeline} data-draw>
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

      <section className={`section on-dark ${e.coverage}`} aria-labelledby="cobertura-title">
        <MoleculeField />
        <div className={`container ${styles.split} ${e.inner}`}>
          <div className={styles.stack}>
            <h2 id="cobertura-title" data-reveal>
              <span className={e.lime}>Cobertura</span>
            </h2>
            <p data-reveal={1}>{coverageSummary}.</p>
          </div>
          <CoverageLine />
        </div>
      </section>

      <ClosingCta image="monitoreo-fosfina-barco" />
    </>
  )
}
