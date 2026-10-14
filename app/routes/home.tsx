import { Phone } from 'lucide-react'
import type { Route } from './+types/home'
import type { RouteHandle } from '~/root'
import { company, salesArea } from '~/content/company'
import { generalFaqs } from '~/content/faqs'
import { primaryServices } from '~/content/services'
import { buildMeta, faqLd, organizationLd } from '~/lib/seo'
import { formatPhone, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import { SplitWords } from '~/components/motion/SplitWords'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { HeroVideo } from '~/components/sections/HeroVideo'
import { FineBand } from '~/components/sections/FineBand'
import { ServiceTiles } from '~/components/sections/ServiceTiles'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { Faq } from '~/components/sections/Faq'
import styles from './home.module.css'

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Plagastop · Control de plagas para empresas e industrias desde 1985',
    rawTitle: true,
    description:
      'Prevención, control y seguimiento de plagas para plantas, bodegas, silos y puertos. Autorizados por el SAG. Desde Ñuble hasta Los Lagos.',
    path: '/',
    jsonLd: [organizationLd, faqLd(generalFaqs)],
  })

export const handle: RouteHandle = { overlayHeader: true }

export default function Home() {
  return (
    <>
      {/* 1. Hero: video real, credenciales bajo el logo y verbo rotativo */}
      <HeroVideo />

      {/* 2. Riesgo: multas del Código Sanitario, centrado sobre turquesa */}
      <FineBand />

      {/* 3. Soluciones para cada operación */}
      <section className={`section ${styles.services}`} aria-labelledby="servicios-title">
        <div className="container">
          <header className={styles.centerHead}>
            <p className={`eyebrow ${styles.eyebrowForest}`} data-reveal>
              Servicios
            </p>
            <h2 id="servicios-title" className={styles.bigTitle} data-reveal={1}>
              <SplitWords text="Soluciones para" />{' '}
              <span className={styles.forest}>
                <SplitWords text="cada operación." start={2} />
              </span>
            </h2>
            <p className="lead" data-reveal={2}>
              Programas preventivos, tratamientos específicos y servicios oficiales para comercio exterior.
            </p>
          </header>
          <ServiceTiles services={primaryServices} />
        </div>
      </section>

      {/* 4. Sede: foto a la izquierda, texto a la derecha */}
      <section className={`${styles.sede} on-dark`} aria-labelledby="sede-title">
        <div className={styles.sedeMedia}>
          <div className={styles.sedePhoto}>
            <Photo id="sede-concepcion" sizes="(min-width: 1000px) 55vw, 100vw" parallax={0.1} />
          </div>
          <div className={styles.sedeInset} data-reveal="2" data-reveal-style="clip">
            <Photo id="equipo-en-nave" sizes="300px" />
          </div>
        </div>
        <div className={styles.sedeCopy}>
          <p className={`eyebrow ${styles.eyebrowTurquoise}`} data-reveal>
            Nuestra sede
          </p>
          <h2 id="sede-title" className={styles.title} data-reveal={1}>
            <SplitWords text="Un respaldo que puedes conocer en" />{' '}
            <span className={styles.lime}>
              <SplitWords text="persona." start={6} />
            </span>
          </h2>
          <p className={styles.sedeText} data-reveal={2}>
            No somos solo una página web. En nuestra sede de Concepción te recibimos para conocer tu operación y
            planificar contigo el programa de tu instalación.
          </p>
          <p className={styles.since} data-reveal={3}>
            <b>Desde {company.foundingYear}</b>
            <span>en {company.address.city}</span>
          </p>
          <p className={styles.address} data-reveal={3}>
            {company.address.street}, {company.address.area} · {company.hours.label}
          </p>
          <div data-reveal={4}>
            <ButtonLink to="/contacto" variant="inverse">
              Agenda una reunión en nuestra sede
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 5. Cobertura: línea con paradas que se dibuja hacia abajo */}
      <section className={`section on-dark ${styles.coverage}`} aria-labelledby="cobertura-title">
        <div className="container">
          <header className={styles.centerHead}>
            <p className={`eyebrow ${styles.eyebrowButter}`} data-reveal>
              Cobertura
            </p>
            <h2 id="cobertura-title" className={styles.bigTitle} data-reveal={1}>
              <SplitWords text="Estamos donde está" />{' '}
              <span className={styles.lime}>
                <SplitWords text="tu operación." start={3} />
              </span>
            </h2>
            <p className={styles.centerLead} data-reveal={2}>
              Salimos desde Concepción a plantas, bodegas y puertos de cuatro regiones, desde Ñuble hasta Los Lagos.
            </p>
          </header>
          <CoverageLine centered />
        </div>
      </section>

      {/* 6. Resolvemos tus dudas: preguntas a la izquierda, título y foto a la derecha */}
      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div className={styles.faqList}>
            <Faq items={generalFaqs} />
          </div>
          <aside className={styles.faqAside}>
            <p className={`eyebrow ${styles.eyebrowForest}`} data-reveal>
              Preguntas frecuentes
            </p>
            <h2 id="faq-title" className={styles.title} data-reveal={1}>
              <SplitWords text="Resolvemos tus" />{' '}
              <span className={styles.turquoise}>
                <SplitWords text="dudas." start={2} />
              </span>
            </h2>
            <p className="lead" data-reveal={2}>
              Si tu pregunta no está aquí, el Área Comercial te responde en horario de atención.
            </p>
            <a
              href={telHref(salesArea.phone)}
              className={styles.phone}
              onClick={() => track('tel_click', { location: 'faq' })}
              data-reveal={3}
            >
              <Phone size={18} strokeWidth={2} aria-hidden />
              <span className="tabular">{formatPhone(salesArea.phone)}</span>
            </a>
            <div className={styles.faqPhoto} data-reveal="3" data-reveal-style="clip">
              <Photo id="fdw-monitoreo-barco" sizes="(min-width: 1000px) 34vw, 100vw" />
            </div>
          </aside>
        </div>
      </section>

      {/* 7. Cierre */}
      <section className={`on-dark ${styles.closing}`} aria-labelledby="cierre-title">
        <div className={`container ${styles.closingInner}`}>
          <h2 id="cierre-title" className={styles.bigTitle} data-reveal>
            <SplitWords text="¿Tu operación necesita control de" />{' '}
            <span className={styles.lime}>
              <SplitWords text="plagas?" start={5} />
            </span>
          </h2>
          <p className={styles.centerLead} data-reveal={1}>
            Te visitamos, evaluamos en terreno y te proponemos un plan a la medida.
          </p>
          <div className={styles.closingActions} data-reveal={2}>
            <ButtonLink to="/cotizar" size="lg" arrow onClick={() => track('cta_click', { location: 'closing' })}>
              Solicitar cotización
            </ButtonLink>
            <ButtonLink
              to={telHref(salesArea.phone)}
              variant="secondary"
              size="lg"
              icon={<Phone size={18} strokeWidth={2} aria-hidden />}
              onClick={() => track('tel_click', { location: 'closing' })}
            >
              {formatPhone(salesArea.phone)}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
