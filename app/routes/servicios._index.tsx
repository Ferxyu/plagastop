import type { Route } from './+types/servicios._index'
import { primaryServices, getService } from '~/content/services'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { ButtonLink, TextLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import { ServiceCards } from '~/components/sections/ServiceCards'
import { Steps } from '~/components/sections/Steps'
import { SectionHeader } from '~/components/ui/SectionHeader'
import { ClosingCta } from '~/components/sections/ClosingCta'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Servicios de control de plagas para empresas',
    description:
      'Manejo integrado de plagas, control de roedores e insectos, sanitización, fumigación de granos, tratamientos SAG y medición Gas Free. Plagastop, desde 1985.',
    path: '/servicios',
    jsonLd: [breadcrumbLd(crumbs)],
  })

export default function Services() {
  const residential = getService('control-de-plagas-residencial')!
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="bodega-preventiva"
        title="Servicios de control de plagas para empresas"
        lead="Programas preventivos, tratamientos específicos y servicios oficiales para comercio exterior. Si no sabes cuál necesitas, partimos con una evaluación en terreno."
        actions={
          <ButtonLink to="/cotizar?servicio=evaluacion" size="lg" arrow>
            Solicitar una evaluación
          </ButtonLink>
        }
      />
      <section className="section section--paper">
        <div className="container">
          <ServiceCards services={primaryServices} headingLevel={2} />
          <p style={{ marginTop: 'var(--s-7)', textAlign: 'center' }}>
            También atendemos hogares y condominios:{' '}
            <TextLink to={`/servicios/${residential.slug}`}>{residential.name}</TextLink>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader title="Cómo trabajamos" lead="Desde tu primera consulta hasta el seguimiento de cada servicio." />
          <Steps />
        </div>
      </section>
      <ClosingCta />
    </>
  )
}
