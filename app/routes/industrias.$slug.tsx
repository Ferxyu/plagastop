import { data } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import type { Route } from './+types/industrias.$slug'
import { getIndustry } from '~/content/industries'
import { getService, type Service } from '~/content/services'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import { secondaryPhoto } from '~/content/photos'
import { PageHero } from '~/components/sections/PageHero'
import { ServiceCards } from '~/components/sections/ServiceCards'
import { IndustryMosaic } from '~/components/sections/IndustryMosaic'
import { Steps } from '~/components/sections/Steps'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { ClosingCta } from '~/components/sections/ClosingCta'
import styles from './page.module.css'

export function loader({ params }: Route.LoaderArgs) {
  const industry = getIndustry(params.slug)
  if (!industry) throw data(null, { status: 404 })
  return { slug: industry.slug }
}

export const meta: Route.MetaFunction = ({ params }) => {
  const industry = getIndustry(params.slug)
  if (!industry) return [{ title: 'Industria no encontrada | Plagastop' }]
  return buildMeta({
    title: industry.seo.title,
    description: industry.seo.description,
    path: `/industrias/${industry.slug}`,
    jsonLd: [
      breadcrumbLd([
        { name: 'Inicio', path: '/' },
        { name: 'Industrias', path: '/industrias' },
        { name: industry.name, path: `/industrias/${industry.slug}` },
      ]),
    ],
  })
}

export default function IndustryPage({ loaderData }: Route.ComponentProps) {
  const industry = getIndustry(loaderData.slug)!
  const services = industry.services.map(getService).filter(Boolean) as Service[]
  const quoteHref = `/cotizar?instalacion=${industry.slug}`

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Industrias', path: '/industrias' },
          { name: industry.name, path: `/industrias/${industry.slug}` },
        ]}
        image={industry.photo}
        title={industry.headline}
        lead={industry.intro}
        actions={
          <ButtonLink
            to={quoteHref}
            size="lg"
            arrow
            onClick={() => track('cta_click', { location: 'industry_hero', industry: industry.slug })}
          >
            Solicitar una evaluación
          </ButtonLink>
        }
      />

      <section className="section">
        <div className={`container ${styles.twoCol}`}>
          <div className={styles.media} data-reveal>
            <Photo id={secondaryPhoto(industry.photo, industry.slug)} sizes="(min-width: 1000px) 45vw, 100vw" />
          </div>
          <div className={styles.stack} data-reveal={1}>
            <h2>Riesgos del rubro</h2>
            <ul className={styles.checklist}>
              {industry.risks.map((risk) => (
                <li key={risk}>
                  <AlertTriangle strokeWidth={2} aria-hidden />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <SectionHeader
            title="Servicios recomendados"
            lead={`Los servicios que más aplicamos en instalaciones de ${industry.label.toLowerCase()}.`}
          />
          <ServiceCards services={services} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Cómo trabajamos" />
          <Steps />
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <SectionHeader title="Otras industrias" />
          <IndustryMosaic exclude={industry.slug} />
        </div>
      </section>

      <ClosingCta quoteHref={quoteHref} location="industry_closing" />
    </>
  )
}
