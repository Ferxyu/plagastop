import { Award, DraftingCompass, MapPin, Ruler } from 'lucide-react'
import type { Route } from './+types/home'
import type { RouteHandle } from '~/root'
import { company } from '~/content/company'
import { generalFaqs } from '~/content/faqs'
import { primaryServices } from '~/content/services'
import { buildMeta, faqLd, organizationLd } from '~/lib/seo'
import { SplitWords } from '~/components/motion/SplitWords'
import { Photo } from '~/components/ui/Photo'
import { HeroVideo } from '~/components/sections/HeroVideo'
import { FineBand } from '~/components/sections/FineBand'
import { ServiceTiles } from '~/components/sections/ServiceTiles'
import { CoverageLine } from '~/components/sections/CoverageLine'
import { Faq } from '~/components/sections/Faq'
import { SedeModel } from '~/components/sections/SedeModel'
import { IsotypeAssembly } from '~/components/brand/IsotypeAssembly'
import { MoleculePortal } from '~/components/brand/MoleculePortal'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './home.module.css'

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Plagastop · Control de plagas para empresas e industrias, más de 25 años',
    rawTitle: true,
    description:
      'Prevención, control y seguimiento de plagas para plantas, bodegas, silos y puertos. Autorizados por el SAG. Desde Concepción, llegamos de Ñuble a Los Lagos.',
    path: '/',
    jsonLd: [organizationLd, faqLd(generalFaqs)],
  })

export const handle: RouteHandle = { overlayHeader: true }

/** Ficha del edificio de la sede (fuentes: Verdugo Arquitecto y Diálogos Urbanos, Colegio de Arquitectos). */
const sedeFacts = [
  {
    icon: DraftingCompass,
    title: 'Arquitecto',
    text: 'Cristián Verdugo Núñez, Verdugo Arquitecto',
    href: 'https://verdugoarquitecto.cl/edificiosC.php',
  },
  { icon: Ruler, title: 'Superficie', text: '327 m² construidos' },
  {
    icon: MapPin,
    title: 'Ubicación',
    text: `${company.address.street}, ${company.address.area}, ${company.address.city}`,
  },
  {
    icon: Award,
    title: 'Reconocimiento',
    text: 'Obra destacada en Diálogos Urbanos, Colegio de Arquitectos',
    href: 'http://dialogosurbanos.blogspot.com/2009/08/obra-destacada-oficinas-plagastop_5378.html',
  },
]

export default function Home() {
  return (
    <>
      {/* 1. Hero: video real, credenciales bajo el logo y verbo rotativo */}
      <HeroVideo />

      {/* 2. Riesgo: multas del Código Sanitario, centrado sobre turquesa */}
      <FineBand />
      <MoleculePortal />

      {/* 3. Soluciones para cada operación */}
      <section className={`section ${styles.services}`} aria-labelledby="servicios-title">
        <div className="container" data-scroll-flow>
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

      {/* 4. Sede: maqueta 3D a la izquierda, texto a la derecha */}
      <section className={`${styles.sede} on-dark`} aria-labelledby="sede-title" data-scroll-card>
        <MoleculeField />
        <div className={styles.sedeMedia} data-reveal="1" data-reveal-style="scale">
          <SedeModel />
        </div>
        <div className={styles.sedeCopy}>
          <p className={`eyebrow ${styles.eyebrowButter}`} data-reveal>
            Nuestra sede
          </p>
          <h2 id="sede-title" className={styles.title} data-reveal={1}>
            <SplitWords text="Una sede que refleja" />{' '}
            <span className={styles.lime}>
              <SplitWords text="nuestra trayectoria." start={4} />
            </span>
          </h2>
          <div className={styles.sedeText} data-reveal={2}>
            <p>
              Nuestra sede en Concepción es una expresión de la identidad y trayectoria de Plagastop. Un espacio que
              acompaña nuestro desarrollo como empresa y refleja la importancia que damos al profesionalismo, la
              confianza y las relaciones de largo plazo.
            </p>
          </div>
          {/* Ficha del edificio: mismo formato compacto en dos columnas que la lista de distinciones */}
          <ul className={styles.distinctions} aria-label="Ficha del edificio">
            {sedeFacts.map((f, i) => (
              <li key={f.title} data-reveal={i}>
                <f.icon size={20} strokeWidth={1.75} aria-hidden />
                <span>
                  <b>{f.title}</b>
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener noreferrer">
                      {f.text}
                    </a>
                  ) : (
                    f.text
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Cobertura: línea con paradas que se dibuja hacia abajo */}
      <section className={`section ${styles.coverage}`} aria-labelledby="cobertura-title" data-scroll-card>
        <div className="container" data-scroll-flow>
          <header className={styles.centerHead}>
            <p className={`eyebrow ${styles.eyebrowBlue} ${styles.coverageEyebrow}`} data-reveal>
              Cobertura
            </p>
            <h2 id="cobertura-title" className={styles.bigTitle} data-reveal={1}>
              <SplitWords text="Estamos donde está" />{' '}
              <span className={styles.blue}>
                <SplitWords text="tu operación." start={3} />
              </span>
            </h2>
            <p className={styles.centerLead} data-reveal={2}>
              Desde Concepción, llegamos de Ñuble a Los Lagos: plantas, bodegas y puertos de cuatro regiones.
            </p>
          </header>
          <CoverageLine centered />
        </div>
      </section>

      {/* 6. Resolvemos tus dudas: preguntas a la izquierda, título y foto a la derecha */}
      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`} data-scroll-flow>
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
              Si tu pregunta no está aquí, escríbenos por WhatsApp y el Área Comercial te responde en horario de atención.
            </p>
            <div className={styles.faqPhoto} data-reveal="3" data-reveal-style="clip">
              <Photo id="fdw-monitoreo-barco" sizes="(min-width: 1000px) 34vw, 100vw" />
            </div>
          </aside>
        </div>
      </section>

      {/* 7. Cierre */}
      <section className={`on-dark ${styles.closing}`} aria-labelledby="cierre-title" data-scroll-card>
        <div className={`container ${styles.closingInner}`} data-scroll-flow>
          <span className={styles.closingPulse} aria-hidden />
          <IsotypeAssembly className={styles.closingIso} />
          <h2 id="cierre-title" className={styles.bigTitle} data-reveal>
            <SplitWords text="¿Tu operación necesita control de" />{' '}
            <span className={styles.lime}>
              <SplitWords text="plagas?" start={5} />
            </span>
          </h2>
          <p className={styles.centerLead} data-reveal={1}>
            Te visitamos, evaluamos en terreno y te proponemos un plan a la medida.
          </p>
        </div>
      </section>
    </>
  )
}
