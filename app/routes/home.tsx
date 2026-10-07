import { Award, Check, FlaskConical, MapPin, Phone, ShieldCheck } from 'lucide-react'
import type { Route } from './+types/home'
import { salesArea } from '~/content/company'
import { telHref } from '~/lib/contact'
import { coverageSummary } from '~/content/coverage'
import { generalFaqs } from '~/content/faqs'
import { primaryServices } from '~/content/services'
import { buildMeta, faqLd, organizationLd } from '~/lib/seo'
import { track } from '~/lib/analytics'
import { QuickQuote } from '~/components/forms/QuickQuote'
import { Counter } from '~/components/motion/Counter'
import { RotatingBadge } from '~/components/motion/RotatingBadge'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { ServiceCards } from '~/components/sections/ServiceCards'
import { IndustryMosaic } from '~/components/sections/IndustryMosaic'
import { Steps } from '~/components/sections/Steps'
import { Faq } from '~/components/sections/Faq'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { ContactDirectory } from '~/components/sections/ContactDirectory'
import { ClosingCta } from '~/components/sections/ClosingCta'
import styles from './home.module.css'

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Plagastop · Control de plagas para empresas e industrias desde 1985',
    rawTitle: true,
    description:
      'Prevención y control de plagas para plantas de alimentos, bodegas, silos y puertos. Autorizados por el SAG. Desde Ñuble hasta Los Lagos.',
    path: '/',
    jsonLd: [organizationLd, faqLd(generalFaqs)],
  })

const strengths = [
  'Autorización SAG para tratamientos fitosanitarios',
  'Laboratorio móvil para granos almacenados',
  'Medición de gases residuales (Gas Free)',
  'Tratamientos en puertos y buques',
  'Programas preventivos con registro de cada visita',
  'Cobertura desde Ñuble hasta Los Lagos',
]

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Autorización oficial',
    text: 'Resolución SAG 2732/2021 para tratamientos fitosanitarios de exportación e importación.',
  },
  {
    icon: MapPin,
    title: 'Cuatro décadas en terreno',
    text: 'Desde 1985 trabajamos en plantas, bodegas, silos y puertos del sur de Chile.',
  },
  {
    icon: FlaskConical,
    title: 'Técnicas especializadas',
    text: 'Fumigación con fosfina, termonebulización y medición de gases residuales en contenedores y naves.',
  },
  {
    icon: Award,
    title: 'Pioneros en calidad',
    text: 'En 2006 fuimos la primera empresa de control de plagas en Chile certificada en ISO 9001.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero: la sede real de Plagastop */}
      <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
        <div className={styles.heroBg}>
          <Photo id="sede-concepcion" sizes="100vw" priority />
          <p className={styles.heroChip}>
            <span className={styles.chipDot} aria-hidden />
            Nuestra sede en Concepción · Desde 1985
          </p>
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title">
              Protegemos la operación de tu empresa <mark>contra las plagas</mark>
            </h1>
            <p className="lead">
              Prevención, control y tratamientos autorizados por el SAG para industrias, bodegas, empresas de
              alimentos y puertos, desde Ñuble hasta Los Lagos.
            </p>
            <div className={styles.heroActions}>
              <ButtonLink to="/cotizar" size="lg" arrow onClick={() => track('cta_click', { location: 'hero' })}>
                Solicitar cotización
              </ButtonLink>
              <ButtonLink
                to={telHref(salesArea.phone)}
                size="lg"
                variant="inverse"
                icon={<Phone size={18} strokeWidth={2} aria-hidden />}
                onClick={() => track('tel_click', { location: 'hero' })}
              >
                Hablar con un especialista
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.quickWrap}`}>
        <QuickQuote />
      </div>

      {/* Nosotros */}
      <section className="section" aria-labelledby="nosotros-title">
        <div className={`container ${styles.about}`}>
          <div className={styles.collage} data-reveal>
            <div className={styles.collageMain}>
              <Photo id="equipo-en-nave" sizes="(min-width: 1000px) 40vw, 100vw" />
            </div>
            <div className={styles.collageCircle}>
              <Photo id="silos-graneles" sizes="240px" />
            </div>
            <div className={styles.collageBadge}>
              <ShieldCheck size={30} strokeWidth={1.75} aria-hidden />
              <span className={styles.badgeTitle}>Autorizados SAG</span>
              <span>Res. 2732/2021</span>
            </div>
          </div>

          <div className={styles.aboutCopy}>
            <h2 id="nosotros-title" data-reveal>
              Cuidamos plantas, bodegas y puertos <mark>desde 1985</mark>
            </h2>
            <p className="lead" data-reveal={1}>
              Somos una empresa de Concepción dedicada a la prevención y el control de plagas. Nuestros equipos
              trabajan donde está el riesgo: en silos, bodegas de graneles, naves y plantas productivas.
            </p>
            <ul className={styles.checks} data-reveal={2}>
              {strengths.map((s) => (
                <li key={s}>
                  <Check size={16} strokeWidth={2.5} aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <dl className={styles.stats} data-reveal={3}>
              <div>
                <dt>Años de trayectoria</dt>
                <dd>
                  <Counter value={40} prefix="+" />
                </dd>
              </div>
              <div>
                <dt>Regiones de cobertura</dt>
                <dd>
                  <Counter value={4} />
                </dd>
              </div>
              <div>
                <dt>Sectores industriales</dt>
                <dd>
                  <Counter value={8} />
                </dd>
              </div>
              <div>
                <dt>Empresa del rubro con ISO 9001 en Chile</dt>
                <dd>1ª</dd>
              </div>
            </dl>
            <TextLink to="/empresa">Conoce Plagastop</TextLink>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="section section--paper" aria-labelledby="servicios-title">
        <div className="container">
          <SectionHeader
            id="servicios-title"
            title={
              <>
                Soluciones para <mark>cada operación</mark>
              </>
            }
            lead="Programas preventivos, tratamientos específicos y servicios oficiales para comercio exterior."
          />
          <ServiceCards services={primaryServices} />
          <p className={styles.servicesNote} data-reveal>
            ¿No sabes qué servicio necesitas?{' '}
            <TextLink to="/cotizar?servicio=evaluacion">Solicita una evaluación en terreno</TextLink>
          </p>
        </div>
      </section>

      {/* Por qué Plagastop */}
      <section className="section section--dark on-dark" aria-labelledby="porque-title">
        <div className={`container ${styles.why}`}>
          <div>
            <SectionHeader
              id="porque-title"
              align="start"
              title={
                <>
                  Un socio técnico para <mark>tu operación</mark>
                </>
              }
              lead="Respaldo oficial, experiencia en terreno y técnicas especializadas para operaciones exigentes."
            />
            <ul className={styles.reasons}>
              {reasons.map((r, i) => (
                <li key={r.title} data-reveal={i}>
                  <span className={styles.reasonIcon}>
                    <r.icon size={24} strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.whyMedia} data-reveal={1}>
            <div className={styles.whyPhoto}>
              <Photo id="medicion-fosfina-graneles" sizes="(min-width: 1000px) 45vw, 100vw" />
            </div>
            <div className={styles.whyBadge}>
              <RotatingBadge />
            </div>
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="section" aria-labelledby="industrias-title">
        <div className="container">
          <SectionHeader
            id="industrias-title"
            align="split"
            title={
              <>
                Experiencia en <mark>cada industria</mark>
              </>
            }
            lead="Cada instalación tiene sus propios riesgos. Conoce cómo trabajamos en la tuya."
            action={<TextLink to="/industrias">Ver todas las industrias</TextLink>}
          />
          <IndustryMosaic />
        </div>
      </section>

      <ClosingCta />

      {/* Cómo trabajamos */}
      <section className="section" aria-labelledby="pasos-title">
        <div className="container">
          <SectionHeader
            id="pasos-title"
            title={
              <>
                Así de simple es <mark>trabajar con nosotros</mark>
              </>
            }
            lead="Desde tu primera consulta hasta el seguimiento de cada servicio."
          />
          <Steps />
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="section section--dark on-dark" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div className={styles.faqMedia} data-reveal>
            <div className={styles.faqPhotoA}>
              <Photo id="fumigacion-placas-degesch" sizes="(min-width: 1000px) 25vw, 60vw" />
            </div>
            <div className={styles.faqPhotoB}>
              <Photo id="detector-gas-residual" sizes="(min-width: 1000px) 20vw, 50vw" />
            </div>
          </div>
          <div>
            <SectionHeader
              id="faq-title"
              align="start"
              title={
                <>
                  Resolvemos tus <mark>dudas</mark>
                </>
              }
            />
            <Faq items={generalFaqs} />
          </div>
        </div>
      </section>

      {/* Cobertura (estructura conservada) */}
      <section className="section section--paper" aria-labelledby="cobertura-title">
        <div className={`container ${styles.coverage}`}>
          <div className={styles.coverageCopy} data-reveal>
            <h2 id="cobertura-title">
              Estamos donde está <mark>tu operación</mark>
            </h2>
            <p className="lead">
              Salimos desde Concepción a plantas, bodegas y puertos de cuatro regiones: {coverageSummary.toLowerCase()}.
            </p>
            <div className={styles.coveragePhoto}>
              <Photo id="aspersion-exterior-silo" sizes="(min-width: 1000px) 35vw, 100vw" />
            </div>
          </div>
          <CoverageLine />
        </div>
      </section>

      {/* Contacto (estructura conservada) */}
      <section className="section" aria-labelledby="contacto-title">
        <div className={`container ${styles.contact}`}>
          <div className={styles.contactCopy} data-reveal>
            <h2 id="contacto-title">
              Habla directo con <mark>el área que necesitas</mark>
            </h2>
            <p className="lead">
              Cada área tiene su propio teléfono y correo. Para cotizar, escribe o llama al Área Comercial.
            </p>
            <ButtonLink to="/cotizar" arrow onClick={() => track('cta_click', { location: 'contact' })}>
              Solicitar cotización
            </ButtonLink>
          </div>
          <div data-reveal={1}>
            <ContactDirectory />
          </div>
        </div>
      </section>
    </>
  )
}
