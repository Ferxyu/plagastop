import { data, Link } from 'react-router'
import { Check } from 'lucide-react'
import type { Route } from './+types/servicios.$slug'
import { credentials } from '~/content/credentials'
import { getIndustry } from '~/content/industries'
import { getService, primaryServices } from '~/content/services'
import { breadcrumbLd, buildMeta, faqLd, serviceLd } from '~/lib/seo'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { PageHero } from '~/components/sections/PageHero'
import { ServiceCards } from '~/components/sections/ServiceCards'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { Faq } from '~/components/sections/Faq'
import { ClosingCta } from '~/components/sections/ClosingCta'
import styles from './page.module.css'

/** Solo se publica un bloque de preguntas cuando hay suficientes para que valga la pena. */
const MIN_FAQS = 3

export function loader({ params }: Route.LoaderArgs) {
  const service = getService(params.slug)
  if (!service) throw data(null, { status: 404 })
  return { slug: service.slug }
}

export const meta: Route.MetaFunction = ({ params }) => {
  const service = getService(params.slug)
  if (!service) return [{ title: 'Servicio no encontrado | Plagastop' }]
  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: service.shortName, path: `/servicios/${service.slug}` },
  ]
  return buildMeta({
    title: service.seo.title,
    description: service.seo.description,
    path: `/servicios/${service.slug}`,
    jsonLd: [
      serviceLd(service),
      breadcrumbLd(crumbs),
      ...((service.faqs?.length ?? 0) >= MIN_FAQS ? [faqLd(service.faqs!)] : []),
    ],
  })
}

export default function ServicePage({ loaderData }: Route.ComponentProps) {
  const service = getService(loaderData.slug)!
  const serviceCredentials = credentials.filter((c) => service.credentialIds?.includes(c.id))
  const related = primaryServices
    .filter((s) => s.slug !== service.slug && s.industries.some((i) => service.industries.includes(i)))
    .slice(0, 4)
  const quoteHref = `/cotizar?servicio=${service.slug}`
  const faqs = (service.faqs?.length ?? 0) >= MIN_FAQS ? service.faqs! : []

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Servicios', path: '/servicios' },
          { name: service.shortName, path: `/servicios/${service.slug}` },
        ]}
        image={service.photo}
        title={service.headline}
        lead={service.intro}
        actions={
          <ButtonLink
            to={quoteHref}
            size="lg"
            arrow
            onClick={() => track('cta_click', { location: 'service_hero', service: service.slug })}
          >
            Cotizar este servicio
          </ButtonLink>
        }
      />

      <section className="section">
        <div className={`container ${styles.twoCol}`}>
          <div className={styles.stack} data-reveal>
            <h2>Cuándo lo necesitas</h2>
            <ul className={styles.checklist}>
              {service.whenNeeded.map((item) => (
                <li key={item}>
                  <Check strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.media} data-reveal={1} data-reveal-style="clip">
            <Photo id={service.photo2} sizes="(min-width: 1000px) 45vw, 100vw" parallax={0.08} />
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className={`container ${styles.twoCol}`}>
          <div className={styles.stack} data-reveal>
            <h2>Qué incluye</h2>
            <ul className={styles.checklist}>
              {service.includes.map((item) => (
                <li key={item}>
                  <Check strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            {serviceCredentials.map((c) => (
              <p key={c.id}>
                <strong>{c.code}</strong> · {c.title}
              </p>
            ))}
          </div>
          <div className={styles.stack} data-reveal={1}>
            {service.industries.length > 0 && (
              <>
                <h2>Dónde lo aplicamos</h2>
                <ul className={styles.chips}>
                  {service.industries.map((slug) => {
                    const industry = getIndustry(slug)
                    return industry ? (
                      <li key={slug}>
                        <Link to={`/industrias/${slug}`}>{industry.name}</Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </>
            )}
            <ButtonLink to={quoteHref} variant="secondary" arrow>
              Solicitar una evaluación
            </ButtonLink>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section">
          <div className={`container ${styles.split}`}>
            <h2>Preguntas frecuentes</h2>
            <Faq items={faqs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section section--sage">
          <div className="container">
            <SectionHeader title="Servicios relacionados" />
            <ServiceCards services={related} />
          </div>
        </section>
      )}

      <ClosingCta
        title={
          <>
            Cotiza <mark>{service.shortName}</mark>
          </>
        }
        text="Cuéntanos dónde está tu instalación y qué necesitas. Te respondemos con una propuesta a la medida de tu operación."
        quoteHref={quoteHref}
        location="service_closing"
      />
    </>
  )
}
