import { data } from 'react-router'
import { Check } from 'lucide-react'
import type { Route } from './+types/servicios.$slug'
import { credentials } from '~/content/credentials'
import { getIndustry } from '~/content/industries'
import { getService, primaryServices } from '~/content/services'
import { breadcrumbLd, buildMeta, faqLd, serviceLd } from '~/lib/seo'
import { Photo } from '~/components/ui/Photo'
import { ServiceIcon } from '~/components/ui/ServiceIcon'
import { PageHero } from '~/components/sections/PageHero'
import { ServiceCards } from '~/components/sections/ServiceCards'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { Faq } from '~/components/sections/Faq'
import { ClosingCta } from '~/components/sections/ClosingCta'
import { IsotypeAssembly } from '~/components/brand/IsotypeAssembly'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './page.module.css'
import s from './service.module.css'

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

/**
 * Landing de servicio: cabecera con moléculas, "Cuándo lo necesitas" en tarjetas numeradas junto a una
 * foto que acompaña el alto del texto, "Qué incluye" en banda azul con moléculas y el isotipo que se arma,
 * y las industrias donde se aplica como texto (no tienen páginas propias). Sin botones de contacto:
 * eso queda en el encabezado y en el botón de WhatsApp.
 */
export default function ServicePage({ loaderData }: Route.ComponentProps) {
  const service = getService(loaderData.slug)!
  const serviceCredentials = credentials.filter((c) => service.credentialIds?.includes(c.id))
  const related = primaryServices
    .filter((r) => r.slug !== service.slug && r.industries.some((i) => service.industries.includes(i)))
    .slice(0, 4)
  const faqs = (service.faqs?.length ?? 0) >= MIN_FAQS ? service.faqs! : []
  const where = service.industries.map((slug) => getIndustry(slug)?.name).filter(Boolean)

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
        molecules
      />

      {/* Cuándo lo necesitas */}
      <section className={`section ${s.need}`} aria-labelledby="cuando-title">
        <MoleculeField tone="light" />
        <div className={`container ${s.needGrid}`}>
          <div className={s.needCopy}>
            <p className={`eyebrow ${s.eyebrow}`} data-reveal>
              {service.shortName}
            </p>
            <h2 id="cuando-title" data-reveal={1}>
              Cuándo lo <span className={s.blue}>necesitas</span>
            </h2>
            <ol className={s.needList}>
              {service.whenNeeded.map((item, i) => (
                <li key={item} data-reveal={i + 2}>
                  <span className={s.needN}>{String(i + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className={s.needMedia} data-reveal={1} data-reveal-style="clip">
            <Photo id={service.photo2} sizes="(min-width: 1000px) 45vw, 100vw" parallax={0.08} />
          </div>
        </div>
        {service.gallery && (
          <div className={`container ${s.gallery}`}>
            <h3 data-reveal>
              {service.shortName} <span className={s.blue}>en terreno</span>
            </h3>
            <ul>
              {service.gallery.map((id, i) => (
                <li key={id} data-reveal={i + 1} data-reveal-style="clip">
                  <Photo id={id} sizes="(min-width: 760px) 32vw, 78vw" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Qué incluye y dónde lo aplicamos */}
      <section className={`section on-dark ${s.includes}`} aria-labelledby="incluye-title">
        <MoleculeField />
        <div className={`container ${s.includesInner}`}>
          <header className={s.includesHead}>
            <IsotypeAssembly className={s.iso} />
            <h2 id="incluye-title" data-reveal>
              Qué <span className={s.lime}>incluye</span>
            </h2>
          </header>
          <ul className={s.includesGrid}>
            {service.includes.map((item, i) => (
              <li key={item} data-reveal={i + 1}>
                <span className={s.includesIcon} aria-hidden>
                  {i === 0 ? <ServiceIcon name={service.icon} /> : <Check strokeWidth={2.5} />}
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
          {serviceCredentials.length > 0 && (
            <p className={s.credentials} data-reveal>
              {serviceCredentials.map((c) => (
                <span key={c.id}>
                  <strong>{c.code}</strong> · {c.title}
                </span>
              ))}
            </p>
          )}
          {where.length > 0 && (
            <div className={s.where} data-reveal>
              <p className={`eyebrow ${s.whereLabel}`}>Dónde lo aplicamos</p>
              <ul>
                {where.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
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
        location="service_closing"
      />
    </>
  )
}
