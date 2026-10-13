import type { CSSProperties } from 'react'
import { Award, BadgeCheck, Check, FlaskConical, MapPin, ShieldCheck } from 'lucide-react'
import type { Route } from './+types/home'
import { coverageSummary } from '~/content/coverage'
import { credentials } from '~/content/credentials'
import { ClientLogos } from '~/components/sections/ClientLogos'
import { generalFaqs } from '~/content/faqs'
import { primaryServices } from '~/content/services'
import { buildMeta, faqLd, organizationLd } from '~/lib/seo'
import { track } from '~/lib/analytics'
import { QuickQuote } from '~/components/forms/QuickQuote'
import { Counter } from '~/components/motion/Counter'
import { RotatingBadge } from '~/components/motion/RotatingBadge'
import { SplitTitle } from '~/components/motion/SplitWords'
import { StatementReveal } from '~/components/motion/StatementReveal'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { StackedServices } from '~/components/sections/StackedServices'
import { IndustryHoverList } from '~/components/sections/IndustryHoverList'
import { ParallaxBand } from '~/components/sections/ParallaxBand'
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
    text: 'Resolución SAG 3273/2025 para tratamientos fitosanitarios de exportación e importación.',
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



const figures = [
  { value: 40, prefix: '+', label: 'años en terreno', bar: 1 },
  { value: 4, label: 'regiones de cobertura', bar: 0.4 },
  { value: 8, label: 'sectores industriales', bar: 0.8 },
  { value: 9, label: 'servicios especializados', bar: 0.9 },
]

export default function Home() {
  return (
    <>
      {/* 1. Hero: la sede, un velo azul marino y el símbolo de Plagastop en 3D */}
      <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
        <div className={styles.heroBg}>
          <Photo id="portada-home" sizes="100vw" priority parallax={-0.2} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title" className={styles.heroTitle}>
              Protegemos la operación de tu empresa <mark>contra las plagas</mark>
            </h1>
            <p className="lead">
              Prevención, control y tratamientos autorizados por el SAG para industrias, bodegas, empresas de
              alimentos y puertos, desde Ñuble hasta Los Lagos.
            </p>
          </div>
        </div>
      </section>

      <div className={`container ${styles.quickWrap}`}>
        <QuickQuote />
      </div>

      {/* 2. Certificaciones */}
      <section className={`section ${styles.certs}`} aria-labelledby="certificaciones-title">
        <div className="container">
          <SectionHeader
            id="certificaciones-title"
            align="split"
            title={<SplitTitle lead="Certificados y" mark="autorizados" />}
            lead="Las autorizaciones que respaldan cada tratamiento que realizamos en tu instalación."
            action={<TextLink to="/acreditaciones">Ver acreditaciones</TextLink>}
          />
          <ul className={styles.certList}>
            {credentials.map((c, i) => (
              <li key={c.id} className={styles.cert} data-reveal={i} data-tilt>
                <span className={styles.certMark} aria-hidden>
                  {c.id.toUpperCase()}
                </span>
                <div className={styles.certTop}>
                  <span className={styles.certIcon}>
                    <BadgeCheck size={30} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className={styles.certTag}>Autorización oficial</span>
                </div>
                <p className={styles.certLabel}>{c.issuer}</p>
                <p className={styles.certCode}>{c.code.replace('Res. ', '')}</p>
                <p className={styles.certText}>{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Empresas que confían en Plagastop */}
      <section className="section section--paper" aria-labelledby="clientes-title">
        <div className="container">
          <SectionHeader
            id="clientes-title"
            title={<SplitTitle lead="Empresas que confían en" mark="Plagastop" />}
            lead="Industrias, empresas de alimentos, transporte, educación y comercio que han trabajado con nosotros."
          />
        </div>
        <ClientLogos />
      </section>

      {/* 3. Nosotros */}
      <section className="section" aria-labelledby="nosotros-title">
        <div className={`container ${styles.about}`}>
          <div className={styles.collage} data-reveal>
            <div className={styles.collageMain} data-reveal={1} data-reveal-style="clip">
              <Photo id="equipo-en-nave" sizes="(min-width: 1000px) 40vw, 100vw" parallax={0.08} />
            </div>
            <div className={styles.collageCircle}>
              <Photo id="silos-graneles" sizes="240px" parallax={-0.12} />
            </div>
            <div className={`${styles.collageBadge} float-soft`}>
              <ShieldCheck size={30} strokeWidth={1.75} aria-hidden />
              <span className={styles.badgeTitle}>Autorizados SAG</span>
              <span>Res. 3273/2025</span>
            </div>
          </div>

          <div className={styles.aboutCopy}>
            <h2 id="nosotros-title" data-reveal>
              <SplitTitle lead="Cuidamos plantas, bodegas y puertos" mark="desde 1985" />
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
            <TextLink to="/empresa">Conoce Plagastop</TextLink>
          </div>
        </div>
      </section>

      {/* 4. Cifras: contadores en lima e infografía de barras */}
      <section className={`section section--neutral ${styles.figures}`} aria-label="Plagastop en cifras">
        <div className="container">
          <ul className={styles.figureList}>
            {figures.map((f, i) => (
              <li key={f.label} data-reveal={i} style={{ '--bar': f.bar } as CSSProperties}>
                <span className={styles.figureValue}>
                  <Counter value={f.value} prefix={f.prefix} />
                </span>
                <span className={styles.figureBar} aria-hidden>
                  <span />
                </span>
                <span className={styles.figureLabel}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Servicios: encabezado fijo y tarjetas que se apilan */}
      <section className="section section--paper" aria-labelledby="servicios-title">
        <div className="container">
          <StackedServices
            services={primaryServices}
            aside={
              <div className={styles.servicesAside} data-reveal>
                <h2 id="servicios-title">
                  <SplitTitle lead="Soluciones para" mark="cada operación" />
                </h2>
                <p className="lead">
                  Programas preventivos, tratamientos específicos y servicios oficiales para comercio exterior.
                </p>
                <ButtonLink
                  to="/cotizar?servicio=evaluacion"
                  arrow
                  onClick={() => track('cta_click', { location: 'services' })}
                >
                  Solicitar una evaluación
                </ButtonLink>
              </div>
            }
          />
        </div>
      </section>

      {/* 6. Fondo con parallax en el medio de la página y declaración cinética */}
      <ParallaxBand image="fdw-contenedores">
        <StatementReveal text="Desde 1985 protegemos plantas, bodegas, silos y puertos del sur de Chile con [tratamientos] [autorizados] y equipos que trabajan donde está el riesgo." />
      </ParallaxBand>

      {/* 7. Por qué Plagastop: tarjetas con inclinación 3D */}
      <section className="section section--sage" aria-labelledby="porque-title">
        <div className="container">
          <SectionHeader
            id="porque-title"
            align="split"
            title={<SplitTitle lead="Un socio técnico para" mark="tu operación" />}
            lead="Respaldo oficial, experiencia en terreno y técnicas especializadas para operaciones exigentes."
          />
          <div className={styles.why}>
            <ul className={styles.reasons}>
              {reasons.map((r, i) => (
                <li key={r.title} data-reveal={i} data-tilt>
                  <span className={styles.reasonIcon}>
                    <r.icon size={26} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
            <div className={styles.whyMedia} data-reveal={1} data-reveal-style="clip">
              <div className={styles.whyPhoto}>
                <Photo id="medicion-fosfina-graneles" sizes="(min-width: 1000px) 35vw, 100vw" parallax={0.1} />
              </div>
              <div className={styles.whyBadge}>
                <RotatingBadge />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Industrias: lista con imagen que aparece al pasar el mouse */}
      <section className="section section--dark on-dark" aria-labelledby="industrias-title">
        <div className="container">
          <SectionHeader
            id="industrias-title"
            align="split"
            title={<SplitTitle lead="Experiencia en" mark="cada industria" />}
            lead="Cada instalación tiene sus propios riesgos. Conoce cómo trabajamos en cada rubro."
            action={<TextLink to="/industrias">Ver todas las industrias</TextLink>}
          />
          <IndustryHoverList />
        </div>
      </section>

      {/* 10. Cómo trabajamos */}
      <section className="section section--neutral" aria-labelledby="pasos-title">
        <div className="container">
          <SectionHeader
            id="pasos-title"
            title={<SplitTitle lead="Así de simple es" mark="trabajar con nosotros" />}
            lead="Desde tu primera consulta hasta el seguimiento de cada servicio."
          />
          <Steps />
        </div>
      </section>

      {/* 11. Cierre con degradado animado */}
      <ClosingCta />

      {/* 12. Preguntas frecuentes */}
      <section className="section section--paper" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div className={styles.faqHead}>
            <SectionHeader
              id="faq-title"
              align="start"
              title={<SplitTitle lead="Resolvemos tus" mark="dudas" />}
              lead="Si tu pregunta no está aquí, el Área Comercial te responde en horario de atención."
            />
            <div className={styles.faqPhoto} data-reveal data-reveal-style="clip">
              <Photo id="fdw-monitoreo-barco" sizes="(min-width: 1000px) 30vw, 100vw" />
            </div>
          </div>
          <Faq items={generalFaqs} />
        </div>
      </section>

      {/* 13. Cobertura (estructura conservada) */}
      <section className="section section--sage" aria-labelledby="cobertura-title">
        <div className={`container ${styles.coverage}`}>
          <div className={styles.coverageCopy} data-reveal>
            <h2 id="cobertura-title">
              <SplitTitle lead="Estamos donde está" mark="tu operación" />
            </h2>
            <p className="lead">
              Salimos desde Concepción a plantas, bodegas y puertos de cuatro regiones: {coverageSummary.toLowerCase()}.
            </p>
            <div className={styles.coveragePhoto}>
              <Photo id="sede-concepcion" sizes="(min-width: 1000px) 35vw, 100vw" parallax={0.1} />
            </div>
          </div>
          <CoverageLine />
        </div>
      </section>

      {/* 14. Contacto (estructura conservada) */}
      <section className="section section--paper" aria-labelledby="contacto-title">
        <div className={`container ${styles.contact}`}>
          <div className={styles.contactCopy} data-reveal>
            <h2 id="contacto-title">
              <SplitTitle lead="Habla directo con" mark="el área que necesitas" />
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
