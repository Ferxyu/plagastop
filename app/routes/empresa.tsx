import { FileSearch, FolderOpen, History, Info, MonitorCheck } from 'lucide-react'
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
import { DIGITAL_HREF, digitalCompany } from '~/content/digital'
import { ButtonLink } from '~/components/ui/Button'
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

const digitalIcons = { folder: FolderOpen, trace: History, digital: MonitorCheck, access: FileSearch }

export default function Company() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="fdw-equipo"
        title="Cuatro décadas controlando plagas en el sur de Chile"
        molecules
        lead={`Plagastop nació en Concepción en ${company.foundingYear}, fundada por ${company.founder}. Desde nuestra sede en el ${company.address.area} protegemos industrias, bodegas, empresas de alimentos y puertos.`}
        actions={
          <ButtonLink to={DIGITAL_HREF} variant="inverse" arrow>
            Gestión digital
          </ButtonLink>
        }
      />

      <section className={`section ${e.light}`}>
        <MoleculeField tone="light" />
        {/* Misión y visión: título centrado; debajo, foto y panel a la misma altura. Sin animación de entrada en el texto */}
        <div className={`container ${e.inner}`}>
          <h2 className={e.mvTitle}>
            Misión y <mark>visión</mark>
          </h2>
          <div className={`${styles.twoCol} ${e.mvGrid}`}>
            <div className={`${styles.media} ${e.mvMedia}`} data-reveal data-reveal-style="clip">
              <Photo id="equipo-plagastop" sizes="(min-width: 1000px) 40vw, 100vw" parallax={0.08} />
            </div>
            <div className={e.mvPanel}>
              <article className={e.mvItem}>
                <h3 className={e.mvLabel}>Misión</h3>
                <p className={e.mvStatement}>{company.mission}</p>
              </article>
              <article className={e.mvItem}>
                <h3 className={e.mvLabel}>Visión</h3>
                <p className={e.mvStatement}>{company.vision}</p>
              </article>
            </div>
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

      {/* Gestión digital (iGEO): explica el beneficio que el home presenta. Destino de /empresa#gestion-digital.
          Sin acceso al portal de clientes (ver content/digital.ts) */}
      <section id="gestion-digital" className={`section ${e.digital}`} aria-labelledby="gestion-digital-title">
        <div className={`container ${e.digitalGrid}`}>
          <div className={e.digitalCopy}>
            <p className={`eyebrow ${e.digitalEyebrow}`} data-reveal>
              {digitalCompany.eyebrow}
            </p>
            <h2 id="gestion-digital-title" data-reveal={1}>
              Tu información, <mark>disponible</mark> cuando la necesitas.
            </h2>
            {digitalCompany.paragraphs.map((p, i) => (
              <p key={p} data-reveal={i + 2}>
                {p}
              </p>
            ))}
            <p className={e.digitalNote} data-reveal={5}>
              <Info size={18} strokeWidth={1.75} aria-hidden />
              {digitalCompany.note}
            </p>
          </div>

          <div className={`${e.digitalPanel} on-dark`} data-reveal={1} data-reveal-style="scale">
            <MoleculeField layout="edges" />
            <ul className={e.digitalBenefits}>
              {digitalCompany.benefits.map((b) => {
                const Icon = digitalIcons[b.icon]
                return (
                  <li key={b.title}>
                    <span className={e.digitalIcon} aria-hidden>
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </li>
                )
              })}
            </ul>
            <p className={e.digitalTech}>
              Tecnología utilizada: <strong>iGEO ERP</strong>, plataforma especializada en control de plagas.
            </p>
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
